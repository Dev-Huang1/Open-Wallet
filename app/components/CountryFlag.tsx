interface CountryFlagProps {
  currency: string
}

export function CountryFlag({ currency }: CountryFlagProps) {
  const getCurrencyFlag = (currency: string) => {
    const flags: Record<string, string> = {
      USD: "🇺🇸",
      EUR: "🇪🇺",
      GBP: "🇬🇧",
      CNY: "🇨🇳",
      JPY: "🇯🇵",
      // Add more currencies as needed
    }
    return flags[currency] || "🌐"
  }

  return <span className="mr-2 text-xl">{getCurrencyFlag(currency)}</span>
}
