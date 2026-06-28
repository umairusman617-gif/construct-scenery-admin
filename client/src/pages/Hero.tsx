import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { heroApi } from "@/api/hero";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormField } from "@/components/shared/FormField";
import { ImageUpload } from "@/components/shared/ImageUpload";

const schema = z.object({
  eyebrow: z.string().min(1),
  headline: z.string().min(1),
  rotatingItems: z.string().min(1),
  bodyText: z.string().min(1),
  cta1Label: z.string().min(1),
  cta1Href: z.string().min(1),
  cta2Label: z.string().min(1),
  cta2Href: z.string().min(1),
  videoUrl: z.string().optional(),
  videoPoster: z.string().optional(),
  trustStats: z.array(z.object({ value: z.string(), label: z.string() })),
});
type FormData = z.infer<typeof schema>;

export function Hero() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["hero"],
    queryFn: () => heroApi.get().then((r) => r.data.data),
  });

  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { trustStats: [{ value: "", label: "" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "trustStats" });

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        rotatingItems: data.rotatingItems?.join(", ") ?? "",
        trustStats: data.trustStats ?? [],
      });
    }
  }, [data, reset]);

  const { mutateAsync } = useMutation({
    mutationFn: (values: FormData) =>
      heroApi.update({
        ...values,
        rotatingItems: values.rotatingItems.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["hero"] }); toast.success("Hero section saved"); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div>
      <PageHeader title="Hero Section" description="Full-screen hero content shown at the top of the portfolio." />
      <form onSubmit={handleSubmit((v) => mutateAsync(v))}>
        <Card>
          <CardContent className="space-y-5 pt-6">
            <FormField label="Eyebrow Text" error={errors.eyebrow?.message}>
              <Input {...register("eyebrow")} placeholder="UK Scenic Construction · Est. 2003" />
            </FormField>

            <FormField label="Main Headline" error={errors.headline?.message}>
              <Input {...register("headline")} placeholder="We Build Worlds" />
            </FormField>

            <FormField label="Rotating Subtitle Items" error={errors.rotatingItems?.message} hint="Comma-separated — e.g. For Film., For Television., For Brands.">
              <Input {...register("rotatingItems")} placeholder="For Film., For Television., For Brands., For Events." />
            </FormField>

            <FormField label="Body Text" error={errors.bodyText?.message}>
              <Textarea {...register("bodyText")} rows={3} />
            </FormField>

            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="CTA 1 Label"><Input {...register("cta1Label")} placeholder="Discuss your project" /></FormField>
              <FormField label="CTA 1 Link"><Input {...register("cta1Href")} placeholder="#contact" /></FormField>
              <FormField label="CTA 2 Label"><Input {...register("cta2Label")} placeholder="Explore portfolio" /></FormField>
              <FormField label="CTA 2 Link"><Input {...register("cta2Href")} placeholder="#work" /></FormField>
            </div>

            <Separator />
            <FormField label="Hero Video URL" hint="Path to MP4 video file">
              <Input {...register("videoUrl")} placeholder="/videos/hero-set.mp4" />
            </FormField>
            <ImageUpload label="Video Poster / Fallback Image" value={watch("videoPoster") ?? ""} onChange={(url) => setValue("videoPoster", url)} />

            <Separator />
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium">Trust Stats</label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "", label: "" })}>
                  <Plus className="mr-1 h-3 w-3" /> Add Stat
                </Button>
              </div>
              <div className="space-y-2">
                {fields.map((field, i) => (
                  <div key={field.id} className="flex gap-2">
                    <Input {...register(`trustStats.${i}.value`)} placeholder="20+" className="w-24" />
                    <Input {...register(`trustStats.${i}.label`)} placeholder="Years experience" className="flex-1" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
