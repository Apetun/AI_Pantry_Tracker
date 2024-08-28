"use client";

import { marked } from "marked";
import DOMPurify from "dompurify";
import { useState, useEffect, useRef } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";

export default function Component() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    image: null,
    quantity: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const [showRecipe, setShowRecipe] = useState(false); // Define showRecipe state
  const [recipeContent, setRecipeContent] = useState(""); // Store the recipe content
  const webcamRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const itemsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsList);
    };
    fetchItems();
  }, []);

  const generateRecipe = async (ingredients) => {
    const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    const YOUR_SITE_URL = "";
    const YOUR_SITE_NAME = "";
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
            "X-Title": `${YOUR_SITE_NAME}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct:free",
            messages: [
              {
                role: "user",
                content: `You are 'AI'sle an AI assistant for generating recipes given a list of items in the pantry,
                          If the ingredients given are valid generate a response otherwise suggest fixes for ingredients,
                          Generate a recipe using the following ingredients: ${ingredients.join(
                            ", "
                          )}`,
              },
            ],

            top_p: 0.5,
            temperature: 0.5,
          }),
        }
      );

      const data = await response.json();
      const generatedRecipe = data.choices[0].message.content;

      const parsedOutput = marked(generatedRecipe);
      const sanitizedOutput = DOMPurify.sanitize(parsedOutput);

      setRecipeContent(sanitizedOutput); // Set the sanitized recipe content
      setShowRecipe(true); // Set showRecipe to true to display the recipe
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
  };

  const handleSuggestRecipes = () => {
    const ingredientNames = filteredItems.map((item) => item.name);
    generateRecipe(ingredientNames);
  };

  const handleInputChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({
          ...newItem,
          image: reader.result, // Base64 encoded image
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setNewItem({
      ...newItem,
      image: imageSrc,
    });
    setShowCamera(false);
  };

  const handleAddItem = async () => {
    try {
      const existingItem = items.find((item) => item.name === newItem.name);

      if (existingItem) {
        const updatedQuantity =
          parseInt(existingItem.quantity, 10) + parseInt(newItem.quantity, 10);
        const itemDoc = doc(db, "inventory", existingItem.id);
        await updateDoc(itemDoc, { quantity: updatedQuantity });

        setItems(
          items.map((item) =>
            item.name === newItem.name
              ? { ...item, quantity: updatedQuantity }
              : item
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "inventory"), {
          name: newItem.name,
          image: newItem.image,
          quantity: newItem.quantity,
        });
        setItems([...items, { ...newItem, id: docRef.id }]);
      }

      setNewItem({
        name: "",
        image: null,
        quantity: 0,
      });
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "inventory", id));
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid min-h-screen w-full bg-background">
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              AI Powered Pantry Tracker
            </h1>
            <p className="text-muted-foreground">
              Add new items to your inventory.
            </p>
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
                    <Input
                      id="name"
                      name="name"
                      value={newItem.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => setShowCamera(!showCamera)}
                      >
                        <CameraIcon className="h-5 w-5" />
                        <span className="sr-only">Take Photo</span>
                      </Button>
                    </div>
                    {showCamera && (
                      <div className="grid gap-2">
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          className="rounded-md"
                        />
                        <Button onClick={handleCapture}>Capture</Button>
                      </div>
                    )}
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
                <h2 className="text-xl font-bold tracking-tight">
                  Current Inventory
                </h2>
                <div className="flex items-center gap-2">
                  <Input
                    type="search"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-xs"
                  />
                  <Button variant="outline" onClick={handleSuggestRecipes}>
                    Suggest Recipes
                  </Button>
                </div>
              </div>
              <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredItems.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="grid gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
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
                              <span className="text-muted-foreground">
                                {item.quantity} in stock
                              </span>
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteItem(item.id, item.image)}
                        >
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

          {showRecipe && (
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Generated Recipe
              </h2>
              <div
                className="prose mt-4"
                dangerouslySetInnerHTML={{ __html: recipeContent }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
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
      className="lucide lucide-box"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.8a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4.47a2 2 0 0 0 2 0l7-4.47A2 2 0 0 0 21 16z"></path>
      <polyline points="3.29 7 12 12 20.71 7"></polyline>
      <line x1="12" y1="22" x2="12" y2="12"></line>
    </svg>
  );
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
      className="lucide lucide-package"
    >
      <path d="M16.5 9.4 7.55 4.24"></path>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4.2a2 2 0 0 0-2 0l-7 4.2A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4.2a2 2 0 0 0 2 0l7-4.2A2 2 0 0 0 21 16z"></path>
      <polyline points="3.29 7 12 12 20.71 7"></polyline>
      <line x1="12" y1="22" x2="12" y2="12"></line>
    </svg>
  );
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
      className="lucide lucide-camera"
    >
      <path d="M14.5 3 16 5h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5l1.5-2h5Z"></path>
      <circle cx="12" cy="13" r="3"></circle>
    </svg>
  );
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
      className="lucide lucide-trash"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6M5 6l1-2h12l1 2"></path>
    </svg>
  );
}
