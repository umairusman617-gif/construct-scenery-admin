import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Film, Image, Users, BookOpen, GitBranch, MessageSquare, Globe, Leaf, Phone, AlignLeft } from "lucide-react";
import { logosApi } from "@/api/logos";
import { projectsApi } from "@/api/projects";
import { processApi } from "@/api/process";
import { testimonialsApi } from "@/api/testimonials";
import { worldsApi } from "@/api/worlds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";

const sections = [
  { label: "Hero Section", icon: Film, to: "/hero", query: null, count: null, singleton: true },
  { label: "Studio (About)", icon: Users, to: "/about", query: null, count: null, singleton: true },
  { label: "Contact / CTA", icon: Phone, to: "/contact", query: null, count: null, singleton: true },
  { label: "Footer", icon: AlignLeft, to: "/footer", query: null, count: null, singleton: true },
  { label: "Sustainability", icon: Leaf, to: "/sustainability", query: null, count: null, singleton: true },
];

export function Dashboard() {
  const results = useQueries({
    queries: [
      { queryKey: ["logos"], queryFn: () => logosApi.list().then((r) => r.data.data) },
      { queryKey: ["projects"], queryFn: () => projectsApi.list().then((r) => r.data.data) },
      { queryKey: ["process"], queryFn: () => processApi.list().then((r) => r.data.data) },
      { queryKey: ["testimonials"], queryFn: () => testimonialsApi.list().then((r) => r.data.data) },
      { queryKey: ["worlds"], queryFn: () => worldsApi.list().then((r) => r.data.data) },
    ],
  });

  const [logos, projects, process, testimonials, worlds] = results;

  const listCards = [
    { label: "Client Logos", icon: Image, to: "/logos", count: logos.data?.length, loading: logos.isLoading },
    { label: "Projects", icon: BookOpen, to: "/projects", count: projects.data?.length, loading: projects.isLoading },
    { label: "Process Steps", icon: GitBranch, to: "/process", count: process.data?.length, loading: process.isLoading },
    { label: "Testimonials", icon: MessageSquare, to: "/testimonials", count: testimonials.data?.length, loading: testimonials.isLoading },
    { label: "Worlds (Cases)", icon: Globe, to: "/worlds", count: worlds.data?.length, loading: worlds.isLoading },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of all portfolio content sections." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listCards.map(({ label, icon: Icon, to, count, loading }) => (
          <Link key={to} to={to}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <div className="text-3xl font-bold">{count ?? "—"}</div>
                )}
                <p className="mt-1 text-xs text-muted-foreground">items</p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {sections.map(({ label, icon: Icon, to }) => (
          <Link key={to} to={to}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer border-dashed">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Singleton section</div>
                <p className="mt-1 text-xs text-muted-foreground">click to edit</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
