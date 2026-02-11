"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import z from "zod"

import { useForm, FormProvider } from "react-hook-form"
import { useCart } from "@/context/CartContext"

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { setName, setTableNumber } = useCart();

    const formSchema = z.object({
        name: z.string().min(1, "Nome obbligatorio"),
        table: z.string().min(1, "Numero tavolo obbligatorio").regex(/^\d+$/, "Inserisci solo numeri"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            table: ""
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setName(values.name);
        setTableNumber(values.table);
        router.push("/menu");
    }


    // Handle validation errors from react-hook-form (zod)
    function onError(errors: any) {
        // If both username and password are missing, show a combined message
        const usernameError = (errors.username as any)?.message;
        const passwordError = (errors.password as any)?.message;

        if (usernameError && passwordError) {
            toast.error(`Nome e Numero tavolo sono obbligatori`);
            return;
        }

        const first = Object.values(errors)[0];
        const message = (first as any)?.message || 'Errore di validazione';
        toast.error(message);
    }

    return (
        <FormProvider {...form}>
            <div className={cn("flex flex-col gap-6")}>
                <Card className="overflow-hidden p-0">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <form className="p-6 md:p-8 place-content-center" onSubmit={form.handleSubmit(onSubmit, onError)}>
                            <FieldGroup>
                                <img
                                    src="/logo.svg"
                                    alt="Logo"
                                    className="mx-auto h-36 w-auto select-none"
                                />
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold select-none">Benvenuto!</h1>
                                    <p className="text-muted-foreground text-balance select-none">
                                        Dicci a chi dobbiamo portare le nostre delizie 🍝
                                    </p>
                                </div>
                                <Field>
                                    <FieldLabel htmlFor="username">Il tuo nome</FieldLabel>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input autoComplete="off" placeholder="Nome" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="table">Numero tavolo</FieldLabel>
                                    <FormField
                                        control={form.control}
                                        name="table"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        autoComplete="off"
                                                        placeholder="Numero tavolo"
                                                        inputMode="numeric"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <Button type="submit" disabled={isLoading} className="w-full select-none">
                                        {isLoading ? "Accesso..." : "Accedi"}
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                        <div className="bg-white items-center justify-center h-150 w-full md:flex hidden">
                            <img
                                src="/placeholder.jpg"
                                alt="Logo"
                                className="object-contain select-none"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </FormProvider>
    )
}
