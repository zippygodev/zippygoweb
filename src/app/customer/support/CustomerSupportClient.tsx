'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { createTicket, addMessage } from '@/actions/support';
import { toast } from '@/components/ui/toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusColors: Record<string, string> = {
  OPEN: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

export default function CustomerSupportClient({ initialTickets }: { initialTickets: any[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  
  // New ticket state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply state
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleCreateTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      toast({ title: 'Error', description: 'Subject and description are required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('description', description);
    formData.append('priority', priority);

    const res = await createTicket(formData);
    if (res.success) {
      toast({ title: 'Ticket Created', description: 'We will get back to you shortly.' });
      setIsNewTicketOpen(false);
      setSubject('');
      setDescription('');
      setPriority('MEDIUM');
      // For simplicity we just reload
      window.location.reload();
    } else {
      toast({ title: 'Error', description: res.error || 'Failed to create ticket', variant: 'destructive' });
    }
    setIsSubmitting(false);
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    setIsReplying(true);
    const res = await addMessage(selectedTicket.id, replyMessage);
    if (res.success) {
      toast({ title: 'Reply Sent', description: 'Message added to ticket.' });
      setReplyMessage('');
      window.location.reload(); 
    } else {
      toast({ title: 'Error', description: res.error || 'Failed to send reply', variant: 'destructive' });
    }
    setIsReplying(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Support & Help Center</h1>
          <p className="text-sm text-muted-foreground">We are here to help you</p>
        </div>
        
        <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and our support team will help you out.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input 
                  placeholder="E.g., Issue with Order #123" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="Please provide details about your issue..."
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTicket} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">My Tickets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="flex flex-col">
                {tickets.map(ticket => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`flex flex-col items-start gap-2 border-b p-4 text-left transition-colors hover:bg-muted/50 ${
                      selectedTicket?.id === ticket.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex w-full items-start justify-between">
                      <span className="font-medium line-clamp-1">{ticket.subject}</span>
                    </div>
                    <div className="flex w-full items-center justify-between text-xs text-muted-foreground mt-1">
                      <Badge variant="outline" className={statusColors[ticket.status]}>
                        {ticket.status}
                      </Badge>
                      <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))}
                {tickets.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    You have no support tickets.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col h-[600px]">
          {selectedTicket ? (
            <>
              <CardHeader className="border-b pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedTicket.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      Ticket #{selectedTicket.id}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={statusColors[selectedTicket.status]}>
                    {selectedTicket.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                 <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                       <div className="rounded-lg border p-4 bg-muted/30">
                          <p className="text-sm">{selectedTicket.description}</p>
                          <p className="mt-2 text-[10px] text-muted-foreground">
                            {new Date(selectedTicket.createdAt).toLocaleString()}
                          </p>
                       </div>
                       
                       <div className="flex items-center justify-center p-4">
                         <Badge variant="outline" className="text-xs text-muted-foreground">
                           Messages History ({selectedTicket._count?.messages || 0})
                         </Badge>
                       </div>
                    </div>
                 </ScrollArea>
                 
                 {selectedTicket.status !== 'CLOSED' ? (
                   <div className="border-t p-4 flex gap-2">
                      <Textarea 
                        placeholder="Type your reply..." 
                        className="min-h-[80px]"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                      />
                      <Button 
                        className="h-auto" 
                        onClick={handleReply}
                        disabled={isReplying || !replyMessage.trim()}
                      >
                        {isReplying ? 'Sending...' : 'Reply'}
                      </Button>
                   </div>
                 ) : (
                   <div className="border-t p-4 text-center text-sm text-muted-foreground">
                     This ticket is closed. If you need further assistance, please open a new ticket.
                   </div>
                 )}
              </CardContent>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="mb-4 h-12 w-12 opacity-20" />
              <p>Select a ticket to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
