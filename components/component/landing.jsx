/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SNTNPClqvC0
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({
    name: "",
    image: null,
    quantity: 0,
  })
  const handleInputChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    })
  }
  const handleImageUpload = (e) => {
    setNewItem({
      ...newItem,
      image: e.target.files[0],
    })
  }
  const handleAddItem = () => {
    setItems([...items, newItem])
    setNewItem({
      name: "",
      image: null,
      quantity: 0,
    })
  }
  return (
    <div className="grid min-h-screen w-full bg-background">
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground">Add new items to your inventory.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add New Item</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={newItem.name} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="flex items-center gap-2">
                    <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageUpload} />
                    <Button variant="outline" size="icon" className="h-10 w-10">
                      <CameraIcon className="h-5 w-5" />
                      <span className="sr-only">Take Photo</span>
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                <Button onClick={handleAddItem}>Add Item</Button>
              </CardContent>
            </Card>
            </div>
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Current Inventory</h2>
                <Button variant="outline">Suggest Recipes</Button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="grid gap-4">
                      {item.image ? (
                        <img
                          src="/placeholder.svg"
                          alt={item.name}
                          width={200}
                          height={200}
                          className="rounded-md object-cover aspect-square"
                        />
                      ) : (
                        <div className="rounded-md bg-muted/40 aspect-square flex items-center justify-center">
                          <PackageIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="grid gap-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="flex items-center gap-2">
                            <BoxIcon className="h-4 w-4 text-muted-foreground" />
                            <span>
                              <span className="text-muted-foreground">{item.quantity} in stock</span>
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <TrashIcon className="h-5 w-5" />
                          <span className="sr-only">Delete {item.name}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function BoxIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}


function CameraIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}


function PackageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}


function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}