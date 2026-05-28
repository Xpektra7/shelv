import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Progress } from '#/components/ui/progress'
import { bulkScrapeUrlFn, searchWebFn } from '#/data/item'
import type { BulkScrapeProgress } from '#/data/item'
import { discoverSchema } from '#/schema/import'
import { LoaderCircle, Search } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { SearchResultWeb } from '@mendable/firecrawl-js'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/discover')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()
  const [searchResults, setSearchResults] = useState<Array<SearchResultWeb>>([])
  const [bulkImportPending, startBulkImport] = useTransition()
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState<BulkScrapeProgress | null>(null)

  const handleSelectAll = () => {
    if (selectedLinks.size === searchResults.length) {
      setSelectedLinks(new Set())
    } else {
      setSelectedLinks(new Set(searchResults.map((result) => result.url)))
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

  const discoverForm = useForm({
    defaultValues: {
      query: '',
    },
    validators: {
      onSubmit: discoverSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const result = await searchWebFn({
          data: value,
        })

        setSearchResults(result)
      })
    },
  })

  return (
    <div className="flex flex-1 gap-2 flex-col items-center justify-center w-full">
      <h1 className="text-3xl font-medium">Discover</h1>
      <p className="text-muted-foreground text-md mb-4v ">
        Search the web for articles on any topic
      </p>
      <div className="w-full max-w-2xl">
        <Card className="max-w-full">
          <CardHeader>
            <CardTitle>Topic Search</CardTitle>
            <CardDescription>
              Search the web for content and import what you find interesting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                discoverForm.handleSubmit()
              }}
            >
              <FieldGroup className="pb-4">
                <discoverForm.Field
                  name="query"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="e.g., React Server Components"
                          type="text"
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
              <Button type="submit" disabled={isPending} className={'w-full'}>
                {isPending ? (
                  <>
                    <HugeiconsIcon
                      icon={LoaderCircle}
                      className="animate-spin"
                    />
                    Searching...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Search} />
                    Search Web
                  </>
                )}
              </Button>
            </form>

            {searchResults.length > 0 && (
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Found {searchResults.length} URLs
                  </p>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedLinks.size === searchResults.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                </div>
                <FieldGroup className="max-h-100 overflow-y-auto p-8 border border-border rounded-md w-full ">
                  {searchResults.map((link) => (
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
                        <FieldDescription>{link.description}</FieldDescription>
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
                        {Math.round(progress.completed / progress.total) * 100}%
                      </span>
                    </FieldLabel>
                    <Progress
                      value={
                        Math.round(progress.completed / progress.total) * 100
                      }
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
      </div>
    </div>
  )
}
