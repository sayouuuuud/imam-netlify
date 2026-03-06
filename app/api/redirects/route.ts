import { createPublicClient } from "@/lib/supabase/public"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const supabase = createPublicClient()
        const { data, error } = await supabase
            .from("redirects")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false })

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "حدث خطأ" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createPublicClient()
        const body = await request.json()

        const { source_path, destination_path, redirect_type = 301, is_active = true } = body

        if (!source_path || !destination_path) {
            return NextResponse.json(
                { error: "يرجى تحديد المسار المصدر والوجهة" },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from("redirects")
            .insert({
                source_path: source_path.startsWith("/") ? source_path : `/${source_path}`,
                destination_path,
                redirect_type,
                is_active,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "حدث خطأ أثناء الإضافة" },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = createPublicClient()
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: "ID مطلوب" }, { status: 400 })
        }

        if (updates.source_path && !updates.source_path.startsWith("/")) {
            updates.source_path = `/${updates.source_path}`
        }

        const { data, error } = await supabase
            .from("redirects")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "حدث خطأ أثناء التحديث" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = createPublicClient()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID مطلوب" }, { status: 400 })
        }

        const { error } = await supabase.from("redirects").delete().eq("id", id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "حدث خطأ أثناء الحذف" },
            { status: 500 }
        )
    }
}
