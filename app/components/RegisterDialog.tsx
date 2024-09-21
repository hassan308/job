import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterDialog({ isOpen, onClose }: RegisterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-gray-900">Registrera</DialogTitle>
          <DialogDescription className="text-lg text-gray-600 mt-2">
            Skapa ett nytt konto.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-email">E-post</Label>
            <Input id="register-email" type="email" placeholder="din@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Lösenord</Label>
            <Input id="register-password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Bekräfta lösenord</Label>
            <Input id="confirm-password" type="password" required />
          </div>
          <Button type="submit" className="w-full">Registrera</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}