import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { sustainabilityApi } from "@/api/sustainability";
import { SustainabilityItem } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { FormField } from "@/components/shared/FormField";
import { ImageUpload } from "@/components/shared/ImageUpload";

const sectionSchema = z.object({
  headline: z.string().min(1),
  bodyText: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string().min(1),
});
const itemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  iconName: z.string().min(1),
  order: z.coerce.number().int().default(0),
});
type SectionData = z.infer<typeof sectionSchema>;
type ItemData = z.infer<typeof itemSchema>;

function ItemForm({ defaultValues, onSubmit, loading }: { defaultValues?: Partial<ItemData>; onSubmit: (d: ItemData) => void; loading: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ItemData>({ resolver: zodResolver(itemSchema), defaultValues: { order: 0, ...defaultValues } });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Title" error={errors.title?.message}><Input {...register("title")} placeholder="Sustainable sourcing" /></FormField>
      <FormField label="Description" error={errors.description?.message}><Textarea {...register("description")} rows={2} /></FormField>
      <FormField label="Lucide Icon Name" error={errors.iconName?.message} hint="e.g. TreePine, Recycle, Wind, Leaf"><Input {...register("iconName")} placeholder="TreePine" /></FormField>
      <FormField label="Display Order"><Input type="number" {...register("order")} /></FormField>
      <DialogFooter><Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Button></DialogFooter>
    </form>
  );
}

export function Sustainability() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["sustainability"], queryFn: () => sustainabilityApi.get().then((r) => r.data.data) });
  const inv = () => qc.invalidateQueries({ queryKey: ["sustainability"] });

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<SectionData>({
    resolver: zodResolver(sectionSchema),
  });
  useEffect(() => { if (data) reset(data); }, [data, reset]);

  const sectionMut = useMutation({ mutationFn: sustainabilityApi.updateSection, onSuccess: () => { inv(); toast.success("Section saved"); }, onError: (e) => toast.error(getErrorMessage(e)) });

  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<SustainabilityItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const createMut = useMutation({ mutationFn: sustainabilityApi.createItem, onSuccess: () => { inv(); setAddOpen(false); toast.success("Item added"); }, onError: (e) => toast.error(getErrorMessage(e)) });
  const updateMut = useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<SustainabilityItem> }) => sustainabilityApi.updateItem(id, data), onSuccess: () => { inv(); setEditItem(null); toast.success("Item updated"); }, onError: (e) => toast.error(getErrorMessage(e)) });
  const deleteMut = useMutation({ mutationFn: sustainabilityApi.deleteItem, onSuccess: () => { inv(); setDeleteId(null); toast.success("Item deleted"); }, onError: (e) => toast.error(getErrorMessage(e)) });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-10">
      <div>
        <PageHeader title="Sustainability" description="'Building responsibly' section content and four pillars." />
        <form onSubmit={handleSubmit((v) => sectionMut.mutateAsync(v))}>
          <Card><CardContent className="space-y-5 pt-6">
            <FormField label="Headline"><Input {...register("headline")} placeholder="Building responsibly." /></FormField>
            <FormField label="Body Text"><Textarea {...register("bodyText")} rows={3} /></FormField>
            <ImageUpload label="Section Image" value={watch("imageUrl") ?? ""} onChange={(url) => setValue("imageUrl", url)} />
            <FormField label="Image Alt Text"><Input {...register("imageAlt")} /></FormField>
          </CardContent></Card>
          <div className="mt-4 flex justify-end"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save Section"}</Button></div>
        </form>
      </div>

      <Separator />

      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Sustainability Pillars</h2>
            <p className="text-sm text-muted-foreground">The four pillars shown in the grid.</p>
          </div>
          <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Pillar</Button>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Icon</TableHead><TableHead>Description</TableHead><TableHead>Order</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {data?.items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell><code className="text-xs bg-muted px-1 rounded">{item.iconName}</code></TableCell>
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{item.description}</TableCell>
                <TableCell>{item.order}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditItem(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}><DialogContent><DialogHeader><DialogTitle>Add Pillar</DialogTitle></DialogHeader><ItemForm onSubmit={(d) => createMut.mutate(d)} loading={createMut.isPending} /></DialogContent></Dialog>
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}><DialogContent><DialogHeader><DialogTitle>Edit Pillar</DialogTitle></DialogHeader>{editItem && <ItemForm defaultValues={editItem} onSubmit={(d) => updateMut.mutate({ id: editItem.id, data: d })} loading={updateMut.isPending} />}</DialogContent></Dialog>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)} onConfirm={() => deleteId !== null && deleteMut.mutate(deleteId)} loading={deleteMut.isPending} />
    </div>
  );
}
