"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function Contact() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus("idle");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to send message");

            setStatus("success");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl flex flex-col px-8 md:px-16 bg-white dark:bg-black min-h-screen">
            <section className="flex flex-col gap-8 py-16">
                <Link href="/about" className="text-sm font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-2 w-fit">
                    &gt; cd ..
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
                    Contact
                </h1>

                <div className="flex flex-col gap-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                    <p>
                        I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                        Feel free to reach out directly via email or use the form below.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-medium text-black dark:text-white">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                    placeholder="Your name"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-medium text-black dark:text-white">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="message" className="text-sm font-medium text-black dark:text-white">Message</label>
                            <textarea
                                id="message"
                                required
                                rows={5}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none"
                                placeholder="Tell me about your project..."
                            />
                        </div>

                        <div className="flex flex-col gap-4 mt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-fit"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {status === "success" && (
                                <p className="text-green-600 dark:text-green-400 text-sm animate-fade-in">
                                    Message sent successfully! I'll get back to you soon.
                                </p>
                            )}
                            {status === "error" && (
                                <p className="text-red-600 dark:text-red-400 text-sm animate-fade-in">
                                    Failed to send message. Please try again or email me directly.
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
