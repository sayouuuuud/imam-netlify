import Script from 'next/script'
import { SchemaType } from '@/lib/schema-generator'

export function JsonLd({ schema }: { schema: SchemaType | SchemaType[] }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
