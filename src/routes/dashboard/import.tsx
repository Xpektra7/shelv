import { useState, useTransition } from 'react'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Field,
  FieldError,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '#/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { bulkScrapeUrlFn, mapUrlFn, scrapeUrlFn } from '#/data/item'
import type { BulkScrapeProgress } from '#/data/item'
import { bulkImport, importSchema } from '#/schema/import'
import {
  Globe02Icon,
  Link01Icon,
  LoaderCircle,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Progress } from '#/components/ui/progress'

export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()
  const [bulkImportPending, startBulkImport] = useTransition()
  const [progress, setProgress] = useState<BulkScrapeProgress | null>(null)
  const [discoveredLinks, setDiscoveredLinks] = useState<
    Array<SearchResultWeb>
  >([])

  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set())

  const handleSelectAll = () => {
    if (selectedLinks.size === discoveredLinks.length) {
      setSelectedLinks(new Set())
    } else {
      setSelectedLinks(new Set(discoveredLinks.map((link) => link.url)))
    }
  }

  const handleToggleLink = (url: string) => {
    const newSelected = new Set(selectedLinks)

    if (newSelected.has(url)) {
      newSelected.delete(url)
    } else {
      newSelected.add(url)
    }

    setSelectedLinks(newSelected)
  }

  const handleBulkImport = () => {
    startBulkImport(async () => {
      if (selectedLinks.size === 0) {
        toast.error('Please select atleast one URL to import.')
        return
      }

      setProgress({
        total: selectedLinks.size,
        completed: 0,
        url: '',
        status: 'success',
      })

      let successCount = 0
      let failedCount = 0

      // await bulkScrapeUrlFn({
      //   data: { urls: Array.from(selectedLinks) },
      // })
      //

      for await (const update of await bulkScrapeUrlFn({
        data: { urls: Array.from(selectedLinks) },
      })) {
        update.status === 'success' ? successCount++ : failedCount++

        setProgress(update)
      }

      setProgress(null)
      failedCount > 0
        ? toast.success(`Imported ${selectedLinks.size} URLs successfully.`)
        : toast.success(
            `Imported ${successCount} of ${selectedLinks.size} URLs successfully.`,
          )
    })
  }

  const singleForm = useForm({
    defaultValues: {
      url: '',
    },
    validators: {
      onSubmit: importSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        console.log(value)
        await scrapeUrlFn({ data: value })
        toast.success('URL Scraped Successfully!')
      })
    },
  })
  const bulkForm = useForm({
    defaultValues: {
      url: '',
      search: '',
    },
    validators: {
      onSubmit: bulkImport,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        console.log(value)
        const links = (await mapUrlFn({ data: value })) || []
        toast.success('Mapped URL Successfully!')
        setDiscoveredLinks(links)
      })
    },
  })

  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <div className="w-full max-w-2xl space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-semibold ">Import Content</h1>
          <p className="pt-2">
            Save web pages to your library for later reading
          </p>
        </div>

        <Tabs defaultValue="single">
          <TabsList className="w-full grid grid-cols-2 rounded-md">
            <TabsTrigger value="single" className="rounded-md">
              <HugeiconsIcon icon={Link01Icon} />
              Single URL
            </TabsTrigger>
            <TabsTrigger value="bulk" className="rounded-md">
              <HugeiconsIcon icon={Globe02Icon} />
              Bulk Import
            </TabsTrigger>
          </TabsList>
          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>Import Single URL</CardTitle>
                <CardDescription>
                  Scrape and save any content from the web!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    singleForm.handleSubmit()
                  }}
                >
                  <FieldGroup className="pb-4">
                    <singleForm.Field
                      name="url"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="https://tanstack.com"
                              type="url"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                  </FieldGroup>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className={'w-full'}
                  >
                    {isPending ? (
                      <>
                        <HugeiconsIcon
                          icon={LoaderCircle}
                          className="animate-spin"
                        />
                        Processing...
                      </>
                    ) : (
                      <>Import URL</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Import</CardTitle>
                <CardDescription>
                  Discover and import multiple URL from a website at once!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    bulkForm.handleSubmit()
                  }}
                >
                  <FieldGroup className="pb-4">
                    <bulkForm.Field
                      name="url"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="https://tanstack.com"
                              type="url"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                    <bulkForm.Field
                      name="search"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Search</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="e.g Blogs, docs, tutorial"
                              type="string"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                  </FieldGroup>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className={'w-full'}
                  >
                    {isPending ? (
                      <>
                        <HugeiconsIcon
                          icon={LoaderCircle}
                          className="animate-spin"
                        />
                        Processing...
                      </>
                    ) : (
                      <>Import URLs</>
                    )}
                  </Button>
                </form>

                {/* Discovered URL list */}
                {discoveredLinks.length > 0 && (
                  <div className="space-y-4 mt-8">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Found {discoveredLinks.length} URLs
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                      >
                        {selectedLinks.size === discoveredLinks.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </Button>
                    </div>
                    <FieldGroup className="max-h-100 overflow-y-auto p-8 border border-border rounded-md w-full ">
                      {discoveredLinks.map((link) => (
                        <Field orientation="horizontal" key={link.url}>
                          <Checkbox
                            id={link.title}
                            name={link.title}
                            checked={selectedLinks.has(link.url)}
                            onCheckedChange={() => handleToggleLink(link.url)}
                          />
                          <FieldContent>
                            <FieldLabel
                              htmlFor={link.title}
                              className="font-heading"
                            >
                              {link.title}
                            </FieldLabel>
                            <FieldDescription>
                              {link.description}
                            </FieldDescription>
                          </FieldContent>
                        </Field>
                      ))}
                    </FieldGroup>

                    {progress && (
                      <Field className="w-full">
                        <FieldLabel htmlFor="progress-upload">
                          <span>
                            Importing: {progress.completed} / {progress.total}
                          </span>
                          <span className="ml-auto">
                            {Math.round(
                              (progress.completed / progress.total) * 100,
                            )}
                            %
                          </span>
                        </FieldLabel>
                        <Progress
                          value={Math.round(
                            (progress.completed / progress.total) * 100,
                          )}
                          id="progress-upload"
                        />
                      </Field>
                    )}

                    <Button
                      className="w-full"
                      disabled={bulkImportPending}
                      onClick={handleBulkImport}
                    >
                      {bulkImportPending ? (
                        <>
                          <HugeiconsIcon
                            icon={LoaderCircle}
                            className="animate-spin"
                          />
                          {progress
                            ? `Importing: ${progress.completed} / ${progress.total} `
                            : 'Importing...'}
                        </>
                      ) : (
                        `Import ${selectedLinks.size} URLs`
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
