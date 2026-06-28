import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { processApi } from "@/api/process";
import { ProcessStep } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { FormField } from "@/components/shared/FormField";

const schema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.coerce.number().int().default(0),
});
type FormData = z.infer<typeof schema>;

function StepForm({ defaultValues, onSubmit, loading }: { defaultValues?: Partial<FormData>; onSubmit: (d: FormData) => void; loading: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { order: 0, ...defaultValues },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-3 grid-cols-2">
        <FormField label="Step Number" error={errors.number?.message}><Input {...register("number")} placeholder="01" /></FormField>
        <FormField label="Display Order"><Input type="number" {...register("order")} /></FormField>
      </div>
      <FormField label="Title" error={errors.title?.message}><Input {...register("title")} placeholder="Discovery" /></FormField>
      <FormField label="Description" error={errors.description?.message}><Textarea {...register("description")} rows={3} /></FormField>
      <DialogFooter><Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Button></DialogFooter>
    </form>
  );
}

export function Process() {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<ProcessStep | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["process"], queryFn: () => processApi.list().then((r) => r.data.data) });
  const inv = () => qc.invalidateQueries({ queryKey: ["process"] });

  const createMut = useMutation({ mutationFn: processApi.create, onSuccess: () => { inv(); setAddOpen(false); toast.success("Step added"); }, onError: (e) => toast.error(getErrorMessage(e)) });
  const updateMut = useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<ProcessStep> }) => processApi.update(id, data), onSuccess: () => { inv(); setEditItem(null); toast.success("Step updated"); }, onError: (e) => toast.error(getErrorMessage(e)) });
  const deleteMut = useMutation({ mutationFn: processApi.delete, onSuccess: () => { inv(); setDeleteId(null); toast.success("Step deleted"); }, onError: (e) => toast.error(getErrorMessage(e)) });

  return (
    <div>
      <PageHeader title="Process Steps" description="The 5-step process timeline shown in the 'How we bring worlds to life' section." action={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Step</Button>} />
      {isLoading ? <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div> : (
        <Table>
          <TableHeader><TableRow><TableHead>№</TableHead><TableHead>Title</TableHead><TableHead>Description</TableHead><TableHead>Order</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {data?.map((s) => (
              <TableRow key={s.id}>
                <TableCell><span className="text-lg font-bold text-muted-foreground">{s.number}</span></TableCell>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{s.description}</TableCell>
                <TableCell>{s.order}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditItem(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Dialog open={addOpen} onOpenChange={setAddOpen}><DialogContent><DialogHeader><DialogTitle>Add Process Step</DialogTitle></DialogHeader><StepForm onSubmit={(d) => createMut.mutate(d)} loading={createMut.isPending} /></DialogContent></Dialog>
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}><DialogContent><DialogHeader><DialogTitle>Edit Process Step</DialogTitle></DialogHeader>{editItem && <StepForm defaultValues={editItem} onSubmit={(d) => updateMut.mutate({ id: editItem.id, data: d })} loading={updateMut.isPending} />}</DialogContent></Dialog>
      <ConfirmDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)} onConfirm={() => deleteId !== null && deleteMut.mutate(deleteId)} loading={deleteMut.isPending} />
    </div>
  );
}
