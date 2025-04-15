import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { id, contentType, updatedItem } = await request.json()

    if (!id || !contentType || !updatedItem) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Validate the updated item
    if (!updatedItem.title || !updatedItem.price) {
      return NextResponse.json({ error: "Title and price are required" }, { status: 400 })
    }

    // Update the item in localStorage
    try {
      const storageKey = contentType === "audio" ? "audioContent" : "videoContent"
      const existingContent = localStorage.getItem(storageKey)

      if (!existingContent) {
        return NextResponse.json({ error: `No ${contentType} content found` }, { status: 404 })
      }

      const contentArray = JSON.parse(existingContent)
      const itemIndex = contentArray.findIndex((item: any) => item.id === id)

      if (itemIndex === -1) {
        return NextResponse.json({ error: `Item with ID ${id} not found` }, { status: 404 })
      }

      // Update the item
      contentArray[itemIndex] = {
        ...contentArray[itemIndex],
        title: updatedItem.title,
        category: updatedItem.category,
        description: updatedItem.description,
        price: updatedItem.price,
        duration: updatedItem.duration,
      }

      // Save the updated content
      localStorage.setItem(storageKey, JSON.stringify(contentArray))

      return NextResponse.json({
        success: true,
        message: `${contentType} item updated successfully`,
      })
    } catch (storageError) {
      console.error("Error updating localStorage:", storageError)
      return NextResponse.json({ error: "Failed to update item in storage" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in update API route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}
