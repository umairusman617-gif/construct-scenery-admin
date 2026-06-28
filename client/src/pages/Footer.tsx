import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { footerApi } from "@/api/footer";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormField } from "@/components/shared/FormField";

const schema = z.object({
  brandName: z.string().min(1),
  tagline: z.string().min(1),
  columnsJson: z.string().min(1),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  vimeo: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function Footer() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["footer"], queryFn: () => footerApi.get().then((r) => r.data.data) });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data) reset({ ...data, columnsJson: JSON.stringify(data.columns, null, 2) });
  }, [data, reset]);

  const { mutateAsync } = useMutation({
    mutationFn: ({ columnsJson, ...rest }: FormData) => {
      let columns;
      try { columns = JSON.parse(columnsJson); } catch { throw new Error("Columns JSON is invalid"); }
      return footerApi.update({ ...rest, columns });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["footer"] }); toast.success("Footer saved"); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div>
      <PageHeader title="Footer" description="Brand info, navigation columns, and social links." />
      <form onSubmit={handleSubmit((v) => mutateAsync(v))}>
        <Card><CardContent className="space-y-5 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Brand Name" error={errors.brandName?.message}><Input {...register("brandName")} placeholder="Construct/Scenery" /></FormField>
          </div>
          <FormField label="Tagline" error={errors.tagline?.message}>
            <Textarea {...register("tagline")} rows={2} />
          </FormField>
          <Separator />
          <FormField label="Navigation Columns (JSON)" error={errors.columnsJson?.message} hint='Array of { title: string, links: string[] }'>
            <Textarea {...register("columnsJson")} rows={10} className="font-mono text-xs" />
          </FormField>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Instagram URL"><Input {...register("instagram")} placeholder="https://instagram.com/..." /></FormField>
            <FormField label="LinkedIn URL"><Input {...register("linkedin")} placeholder="https://linkedin.com/..." /></FormField>
            <FormField label="Vimeo URL"><Input {...register("vimeo")} placeholder="https://vimeo.com/..." /></FormField>
          </div>
        </CardContent></Card>
        <div className="mt-6 flex justify-end"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save Changes"}</Button></div>
      </form>
    </div>
  );
}
