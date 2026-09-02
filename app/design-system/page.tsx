import { ArrowRight, Frame, Layers, Plus, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormDescription, FormField, FormLabel, FormSection } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Switch } from "@/components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { Tooltip } from "@/components/ui/Tooltip";
import { CodeText, Heading, Kicker, Text } from "@/components/ui/Typography";
import {
    ActivityTimeline,
    ChatMessage,
    ChatMetaBadge,
    CodePreview,
    DesignSystemReferenceCard,
    GenerationPreview,
    MetricTile,
    OnboardingFlow,
    PageHeader,
    ProjectCard,
    ReferenceInspector,
    StatusPill,
} from "@/components/clayface";

const sampleCode = `import { Button } from "@/components/ui/Button";

export function PromptAction() {
  return (
    <Button className="gap-2">
      Generate component
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}`;

export default function DesignSystemPage() {
    return (
        <main className="min-h-screen bg-background px-4 py-6 text-foreground md:px-6 md:py-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <PageHeader
                    eyebrow={<StatusPill label="System" value="Clayface" tone="accent" />}
                    title="Design system"
                    description="A live inventory of the Clayface primitives and product workflow components."
                    actions={
                        <Button className="gap-2">
                            New component
                            <Plus className="h-4 w-4" />
                        </Button>
                    }
                />

                <section className="grid gap-4 md:grid-cols-4">
                    <MetricTile label="Primitives" value="20+" detail="Shared UI atoms" />
                    <MetricTile label="Product" value="15" detail="Clayface workflow pieces" />
                    <MetricTile label="Radius" value="5" detail="Morph scale steps" />
                    <MetricTile label="Accent" value="1" detail="Fired Bronze only" />
                </section>

                <Card>
                    <CardHeader>
                        <CardTitle>Typography</CardTitle>
                        <CardDescription>Role-based text variants for product UI, brand display, labels, metadata, code, and editorial accents.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                            <div className="space-y-4">
                                <Kicker>Brand display</Kicker>
                                <Heading as="h1" variant="hero">Build UI at the speed of thought</Heading>
                                <Text variant="body-lg" tone="secondary" className="measure-compact">
                                    Hero and display text use Instrument Serif only for brand surfaces and large editorial moments.
                                </Text>
                            </div>
                            <div className="space-y-4 rounded-[var(--r-2)] border border-border bg-background p-5">
                                <Kicker>Product hierarchy</Kicker>
                                <Heading as="h2" variant="title-1">Project workspace</Heading>
                                <Heading as="h3" variant="title-2">Design references</Heading>
                                <Heading as="h4" variant="title-3">Primary Figma file</Heading>
                                <Heading as="h5" variant="title-4">Selection metadata</Heading>
                                <Heading as="h6" variant="subheading">Reference import settings</Heading>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-[var(--r-1)] border border-border bg-background p-4">
                                <Kicker>Body</Kicker>
                                <Text variant="body-lg" className="mt-3">Large body for lead descriptions and dense onboarding explanations.</Text>
                                <Text variant="body" tone="secondary" className="mt-3">Default body text for readable product copy and settings descriptions.</Text>
                                <Text variant="body-sm" tone="tertiary" className="mt-3">Small body text for helper copy, previews, and compact rows.</Text>
                            </div>
                            <div className="rounded-[var(--r-1)] border border-border bg-background p-4">
                                <Kicker>Labels</Kicker>
                                <Text variant="label" className="mt-3">Field label</Text>
                                <Text variant="label-sm" tone="secondary" className="mt-3">Compact label</Text>
                                <Text variant="caption" className="mt-3">Caption or supporting metadata</Text>
                                <Text variant="micro" tone="tertiary" className="mt-3">Micro text for tiny status marks</Text>
                            </div>
                            <div className="rounded-[var(--r-1)] border border-border bg-background p-4">
                                <Kicker>Compiler</Kicker>
                                <CodeText className="mt-3 inline-block">ProjectCard.tsx</CodeText>
                                <p className="text-code mt-3">const stack = &quot;Next.js&quot;;</p>
                                <p className="text-code-sm mt-3 text-text-secondary">file_key:12-34</p>
                            </div>
                            <div className="rounded-[var(--r-1)] border border-border bg-background p-4">
                                <Kicker>Serif accent</Kicker>
                                <Text variant="serif-note" className="mt-3">
                                    Use this voice for occasional brand notes, not controls or labels.
                                </Text>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Controls</CardTitle>
                            <CardDescription>Buttons, form fields, selectors, and binary controls.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="flex flex-wrap gap-2">
                                <Button>Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="destructive">Delete</Button>
                            </div>
                            <FormSection className="grid gap-4">
                                <FormField>
                                    <FormLabel htmlFor="showcase-name">Project name</FormLabel>
                                    <Input id="showcase-name" placeholder="Marketing site redesign" />
                                    <FormDescription>Use short, scannable labels in product forms.</FormDescription>
                                </FormField>
                                <FormField>
                                    <FormLabel htmlFor="showcase-kind">Output type</FormLabel>
                                    <Select id="showcase-kind" defaultValue="component">
                                        <option value="page">Page</option>
                                        <option value="component">Component</option>
                                        <option value="flow">Flow</option>
                                    </Select>
                                </FormField>
                                <FormField>
                                    <FormLabel htmlFor="showcase-notes">Reference notes</FormLabel>
                                    <Textarea id="showcase-notes" placeholder="Spacing, typography, interaction rules..." />
                                </FormField>
                                <div className="flex flex-wrap items-center gap-5">
                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <Checkbox defaultChecked />
                                        Primary reference
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <Switch defaultChecked />
                                        Sync Figma
                                    </label>
                                </div>
                            </FormSection>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Feedback and overlays</CardTitle>
                            <CardDescription>Alerts, badges, tabs, popovers, tooltip, skeletons, and dialogs.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="flex flex-wrap gap-2">
                                <Badge>Primary</Badge>
                                <Badge variant="secondary">Draft</Badge>
                                <Badge variant="success">Ready</Badge>
                                <Badge variant="warning">Review</Badge>
                                <Badge variant="error">Error</Badge>
                            </div>
                            <Alert variant="success">
                                <AlertTitle>Reference saved</AlertTitle>
                                <AlertDescription>Clayface will use this system for new generations.</AlertDescription>
                            </Alert>
                            <Tabs defaultValue="one">
                                <TabsList>
                                    <TabsTrigger value="one">Preview</TabsTrigger>
                                    <TabsTrigger value="two">Code</TabsTrigger>
                                </TabsList>
                                <TabsContent value="one" className="rounded-[var(--r-1)] border border-border bg-background p-4">
                                    Preview tab content
                                </TabsContent>
                                <TabsContent value="two" className="rounded-[var(--r-1)] border border-border bg-background p-4">
                                    Code tab content
                                </TabsContent>
                            </Tabs>
                            <div className="flex flex-wrap gap-2">
                                <Popover>
                                    <PopoverTrigger className="h-9 rounded-[var(--r-1)] border border-border bg-background px-3 text-sm">
                                        Open popover
                                    </PopoverTrigger>
                                    <PopoverContent align="start">Compact floating content for product actions.</PopoverContent>
                                </Popover>
                                <Tooltip content="Tooltips explain icon-only controls.">
                                    <Button variant="outline" className="h-9 w-9 p-0">
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </Tooltip>
                                <Dialog>
                                    <DialogTrigger className="h-9 rounded-[var(--r-1)] border border-border bg-background px-3 text-sm">
                                        Open dialog
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create reference</DialogTitle>
                                            <DialogDescription>Add source material for a project generation.</DialogDescription>
                                        </DialogHeader>
                                        <DialogBody>
                                            <Input placeholder="Reference name" />
                                        </DialogBody>
                                        <DialogFooter>
                                            <DialogClose className="h-9 w-auto px-4">Cancel</DialogClose>
                                            <Button>Save</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-6">
                        <ProjectCard
                            id="preview"
                            name="Acme launch system"
                            description="Landing pages, pricing sections, and onboarding states."
                            status="active"
                            counts={{ chats: 3, designs: 7, references: 2 }}
                            chats={[
                                { id: "preview-chat", title: "Pricing table variants", summary: "Reference-led component pass" },
                                { id: "preview-chat-2", title: "Signup flow", summary: "Reduce field friction" },
                            ]}
                        />
                        <DesignSystemReferenceCard
                            name="Acme Figma Library"
                            description="Primary typography, spacing, and component references."
                            sourceType="FIGMA"
                            sourceUrl="https://www.figma.com"
                            isPrimary
                        />
                        <EmptyState
                            icon={<Layers className="h-4 w-4" />}
                            title="No generated designs"
                            description="Create a prompt or attach a reference to start building a design trail."
                            action={<Button>Create first design</Button>}
                        />
                    </div>

                    <div className="space-y-6">
                        <CodePreview
                            title="PromptAction.tsx"
                            files={[{ name: "PromptAction.tsx", code: sampleCode }]}
                            preview={
                                <div className="flex min-h-72 items-center justify-center bg-background p-8">
                                    <Button className="gap-2">
                                        Generate component
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            }
                        />
                        <GenerationPreview
                            componentName="PricingTable.tsx"
                            description="Three-tier pricing component generated from a reference-led brief."
                            files={["PricingTable.tsx", "pricing.config.ts"]}
                            time="2m ago"
                            active
                        />
                        <ChatMessage
                            role="user"
                            content="Create a pricing section that follows the attached Figma system."
                            time="11:42"
                            user={{ name: "Clayface User" }}
                            meta={
                                <>
                                    <ChatMetaBadge>Next.js</ChatMetaBadge>
                                    <ChatMetaBadge>Shadcn UI</ChatMetaBadge>
                                </>
                            }
                        />
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity timeline</CardTitle>
                            <CardDescription>Project events and generated work history.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ActivityTimeline
                                items={[
                                    { id: "1", title: "Reference attached", detail: "Acme Figma Library set as primary.", createdAt: new Date() },
                                    { id: "2", title: "Design created", detail: "Pricing section moved to review.", createdAt: new Date() },
                                ]}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Onboarding flow</CardTitle>
                            <CardDescription>Role, stack, and reference setup for broad user types.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OnboardingFlow
                                steps={[
                                    {
                                        id: "role",
                                        title: "User type",
                                        description: "Developer, designer, team, or agency.",
                                        content: <Input placeholder="What best describes you?" />,
                                    },
                                    {
                                        id: "stack",
                                        title: "Stack",
                                        description: "Target framework and component library.",
                                        content: <Select defaultValue="next"><option value="next">Next.js</option><option value="react">React</option></Select>,
                                    },
                                    {
                                        id: "reference",
                                        title: "Reference",
                                        description: "Figma, link, upload, or notes.",
                                        content: <Button variant="outline" className="gap-2"><Frame className="h-4 w-4" />Attach Figma</Button>,
                                    },
                                ]}
                            />
                        </CardContent>
                    </Card>
                </section>

                <ReferenceInspector
                    rows={[
                        { label: "File", value: "Acme UI Library" },
                        { label: "Node ID", value: "12:34", mono: true },
                        { label: "Layout", value: "Auto layout" },
                    ]}
                    payload={{ file: "Acme UI Library", node: "12:34", type: "FRAME" }}
                />
            </div>
        </main>
    );
}
