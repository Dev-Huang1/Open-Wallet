import { useLanguage } from "../contexts/LanguageContext"
import { useTransactions } from "../hooks/useTransactions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Globe, Upload, Download } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export default function MenuBar() {
  const { language, setLanguage } = useLanguage()
  const { balance, currency, transactions, importData } = useTransactions()
  const { toast } = useToast()
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en")
  }

  const handleExport = () => {
    const data = { balance, currency, transactions }
    const dataStr = JSON.stringify(data)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "expense_tracker_data.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleImportClick = () => {
    setIsImportDialogOpen(true)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImportFile(event.target.files[0])
    }
  }

  const handleImport = () => {
    if (importFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          importData(importedData)
          setIsImportDialogOpen(false)
          toast({
            title: language === "en" ? "Import Successful" : "导入成功",
            description: language === "en" ? "Your data has been imported successfully." : "您的数据已成功导入。",
          })
        } catch (error) {
          toast({
            title: language === "en" ? "Import Failed" : "导入失败",
            description: language === "en" ? "There was an error importing your data." : "导入数据时出现错误。",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(importFile)
    }
  }

  return (
    <div className="flex justify-end mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{language === "en" ? "Menu" : "菜单"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleLanguage}>
            <Globe className="mr-2 h-4 w-4" />
            {language === "en" ? "Switch to 中文" : "Switch to English"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {language === "en" ? "Export Data" : "导出数据"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportClick}>
            <Upload className="mr-2 h-4 w-4" />
            {language === "en" ? "Import Data" : "导入数据"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Import Data" : "导入数据"}</DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "This will overwrite your current data. Are you sure you want to proceed?"
                : "这将覆盖您当前的数据。您确定要继续吗？"}
            </DialogDescription>
          </DialogHeader>
          <input type="file" accept=".json" onChange={handleFileChange} />
          <DialogFooter>
            <Button onClick={() => setIsImportDialogOpen(false)} variant="outline">
              {language === "en" ? "Cancel" : "取消"}
            </Button>
            <Button onClick={handleImport} disabled={!importFile}>
              {language === "en" ? "Import" : "导入"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
