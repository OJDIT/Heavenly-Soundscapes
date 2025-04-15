import Link from "next/link"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample cart data - in a real app, this would be managed with state
const cartItems = [
  {
    id: "gospel-praise-1",
    title: "Joyful Praise",
    price: 29.99,
    imageUrl: "/placeholder.svg?height=100&width=100",
    quantity: 1,
  },
  {
    id: "gospel-worship-1",
    title: "Spirit Worship",
    price: 34.99,
    imageUrl: "/placeholder.svg?height=100&width=100",
    quantity: 1,
  },
]

export default function CartPage() {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.07 // 7% tax
  const total = subtotal + tax

  return (
    <div className="container py-6 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 overflow-x-auto">
            <div className="min-w-[600px] lg:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 md:gap-4">
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.title}
                            className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md"
                          />
                          <div>
                            <div className="font-medium text-sm md:text-base">{item.title}</div>
                            <div className="text-xs md:text-sm text-muted-foreground">Digital Download</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm md:text-base">${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 md:gap-2">
                          <Button variant="outline" size="icon" className="h-6 w-6 md:h-8 md:w-8">
                            <Minus className="h-2 w-2 md:h-3 md:w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            className="w-10 md:w-16 h-6 md:h-8 text-center text-sm md:text-base"
                            min="1"
                          />
                          <Button variant="outline" size="icon" className="h-6 w-6 md:h-8 md:w-8">
                            <Plus className="h-2 w-2 md:h-3 md:w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm md:text-base">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="text-red-500 h-6 w-6 md:h-8 md:w-8">
                          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between mt-6 md:mt-8">
              <Button asChild variant="outline">
                <Link href="/catalog">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <div className="bg-muted p-4 md:p-6 rounded-lg">
              <h2 className="text-lg md:text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4 text-sm md:text-base">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (7%)</span>
                  <span>£{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>

              <div className="mt-4 text-xs md:text-sm text-muted-foreground text-center">
                Secure checkout powered by Stripe
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 md:py-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
            Looks like you haven't added any beats to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/catalog">Browse Beats</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
