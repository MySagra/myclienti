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

import { useForm, FormProvider, type FieldErrors } from "react-hook-form"
import { useCart } from "@/context/CartContext"
import { useSettings } from "@/context/SettingsContext"
import { NO_TABLE, tableFieldCopy, tableValueSchema } from "@/lib/table"
import { useTranslation } from "react-i18next"

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { setName, setTableNumber } = useCart();
    const { settings } = useSettings();
    const { t } = useTranslation();
    const tableSettings = settings.table;
    const showTable = tableSettings.enabled;
    const tableCopy = tableFieldCopy(tableSettings);

    // Read saved user info for precompilation
    const getSavedUser = () => {
        if (typeof window === "undefined") return { name: "", table: "" };
        try {
            const saved = sessionStorage.getItem("mysagra-user");
            if (saved) {
                const parsed = JSON.parse(saved);
                const table = parsed.tableNumber && parsed.tableNumber !== NO_TABLE ? parsed.tableNumber : "";
                return { name: parsed.name || "", table };
            }
        } catch { }
        return { name: "", table: "" };
    };
    const savedUser = getSavedUser();

    // Customer name is always required; the table depends on the settings (HIDDEN removes it)
    const formSchema = z.object({
        name: z.string().trim().min(1, t("login.nameRequired")).max(36, t("login.nameTooLong")),
        table: showTable ? tableValueSchema(tableSettings, t) : z.string().optional(),
    });

    const form = useForm<z.input<typeof formSchema>, unknown, z.output<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: savedUser.name,
            table: showTable ? savedUser.table : "",
        }
    });

    async function onSubmit(values: z.output<typeof formSchema>) {
        setName(values.name);
        setTableNumber(showTable ? (values.table ?? "") : NO_TABLE);
        sessionStorage.removeItem("mysagra-user");
        router.push("/menu");
    }

    // Handle validation errors from react-hook-form (zod)
    function onError(errors: FieldErrors<z.input<typeof formSchema>>) {
        if (errors.name && errors.table && !form.getValues("name") && !form.getValues("table")) {
            toast.error(t("login.nameAndTableRequired", { table: t(tableCopy.label).toLowerCase() }));
            return;
        }
        const message = errors.name?.message || errors.table?.message || t("login.validationError");
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
                                    <h1 className="text-2xl font-bold select-none">{t("login.greeting")}</h1>
                                    <p className="text-muted-foreground select-none">
                                        {t("login.subtitle")}
                                    </p>
                                </div>
                                <Field>
                                    <FieldLabel htmlFor="username">{t("login.nameLabel")}</FieldLabel>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input autoComplete="off" placeholder={t("login.namePlaceholder")} {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </Field>
                                {showTable && (
                                    <Field>
                                        <FieldLabel htmlFor="table">{t(tableCopy.label)}</FieldLabel>
                                        <FormField
                                            control={form.control}
                                            name="table"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            autoComplete="off"
                                                            placeholder={t(tableCopy.placeholder)}
                                                            inputMode={tableCopy.inputMode}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </Field>
                                )}
                                <Field>
                                    <Button type="submit" disabled={isLoading} className="w-full select-none">
                                        {isLoading ? t("login.submitting") : t("login.submit")}
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
