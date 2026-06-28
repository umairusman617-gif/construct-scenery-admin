import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { contactApi } from "@/api/contact";
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
  headline: z.string().min(1),
  bodyText: z.string().min(1),
  cta1Label: z.string().min(1),
  cta1Email: z.string().email(),
  cta2Label: z.string().min(1),
  cta2Email: z.string().email(),
});
type FormData = z.infer<typeof schema>;

export function Contact() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["contact"], queryFn: () => contactApi.get().then((r) => r.data.data) });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  useEffect(() => { if (data) reset(data); }, [data, reset]);

  const { mutateAsync } = useMutation({
    mutationFn: contactApi.update,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["contact"] }); toast.success("Contact section saved"); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div>
      <PageHeader title="Contact / CTA Section" description="The 'Let's build something extraordinary' call-to-action section." />
      <form onSubmit={handleSubmit((v) => mutateAsync(v))}>
        <Card><CardContent className="space-y-5 pt-6">
          <FormField label="Headline" error={errors.headline?.message}>
            <Input {...register("headline")} placeholder="Let's build something extraordinary." />
          </FormField>
          <FormField label="Body Text" error={errors.bodyText?.message}>
            <Textarea {...register("bodyText")} rows={3} />
          </FormField>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="CTA 1 Label" error={errors.cta1Label?.message}><Input {...register("cta1Label")} placeholder="Start your project" /></FormField>
            <FormField label="CTA 1 Email" error={errors.cta1Email?.message}><Input {...register("cta1Email")} type="email" placeholder="hello@constructscenery.co.uk" /></FormField>
            <FormField label="CTA 2 Label" error={errors.cta2Label?.message}><Input {...register("cta2Label")} placeholder="Book a consultation" /></FormField>
            <FormField label="CTA 2 Email" error={errors.cta2Email?.message}><Input {...register("cta2Email")} type="email" placeholder="hello@constructscenery.co.uk" /></FormField>
          </div>
        </CardContent></Card>
        <div className="mt-6 flex justify-end"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save Changes"}</Button></div>
      </form>
    </div>
  );
}
