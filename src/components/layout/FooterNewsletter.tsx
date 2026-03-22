interface FooterNewsletterProps {
    title: string;
    subtitle: string;
}

export function FooterNewsletter({ title, subtitle }: FooterNewsletterProps) {
    return (
        <div className="border-b border-zinc-800">
            <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
                    <p className="text-sm text-zinc-500">{subtitle}</p>
                </div>
                <div className="flex flex-col xs:flex-row w-full md:w-auto gap-2 xs:gap-0">
                    <input
                        type="email"
                        placeholder="Seu melhor e-mail"
                        className="flex-1 md:w-72 bg-zinc-900 border border-zinc-800 rounded-xl xs:rounded-r-none xs:rounded-l-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                    />
                    <button className="bg-white text-zinc-950 px-6 py-3 rounded-xl xs:rounded-l-none xs:rounded-r-xl text-sm font-semibold hover:bg-zinc-100 transition-colors whitespace-nowrap">
                        Inscrever
                    </button>
                </div>
            </div>
        </div>
    )
}
