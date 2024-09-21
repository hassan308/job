import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginDialog({ isOpen, onClose }: LoginDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-900">Logga in</DialogTitle>
          <DialogDescription className="text-lg text-gray-600 mt-2">
            Ange dina inloggningsuppgifter nedan.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input id="email" type="email" placeholder="din@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Lösenord</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">Logga in</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}