'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, MessageSquare, Clock, User, AlertCircle } from 'lucide-react';
import { updateTicketStatus, addMessage } from '@/actions/support';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const statusColors: Record<string, string> = {
  OPEN: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

const priorityColors: Record<string, string> = {
  LOW: 'text-gray-500',
  MEDIUM: 'text-blue-500',
  HIGH: 'text-orange-500',
  URGENT: 'text-red-500 font-bold',
};

export default function SupportClient({ initialTickets }: { initialTickets: any[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(search.toLowerCase()) || 
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (id: string, status: string) => {
    const res = await updateTicketStatus(id, status);
    if (res.success) {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      toast({ title: 'Status Updated', description: `Ticket marked as ${status}.` });
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    setIsReplying(true);
    const res = await addMessage(selectedTicket.id, replyMessage);
    if (res.success) {
      toast({ title: 'Reply Sent', description: 'Message added to ticket.' });
      setReplyMessage('');
      // Ideally re-fetch or optimistically update, for now we will just re-fetch by doing a hard reload
      window.location.reload(); 
    } else {
      toast({ title: 'Error', description: res.error || 'Failed to send reply', variant: 'destructive' });
    }
    setIsReplying(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Support Tickets</h1>
        <p className="text-sm text-muted-foreground">Manage customer queries and issues</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ticket List</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="flex flex-col">
                {filteredTickets.map(ticket => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`flex flex-col items-start gap-2 border-b p-4 text-left transition-colors hover:bg-muted/50 ${
                      selectedTicket?.id === ticket.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex w-full items-start justify-between">
                      <span className="font-medium line-clamp-1">{ticket.subject}</span>
                      <Badge variant="outline" className={statusColors[ticket.status]}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {ticket.user?.name || 'Customer'}
                      </span>
                      <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`text-[10px] ${priorityColors[ticket.priority]}`}>
                      {ticket.priority} PRIORITY
                    </span>
                  </button>
                ))}
                {filteredTickets.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No tickets found.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col h-[700px]">
          {selectedTicket ? (
            <>
              <CardHeader className="border-b pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedTicket.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      Ticket #{selectedTicket.id} • Created by {selectedTicket.user?.name} ({selectedTicket.user?.email})
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(val) => handleStatusChange(selectedTicket.id, val)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                       
                       {/* Ideally we fetch detailed messages when selecting a ticket. For this demo we just show a placeholder if we didn't fetch messages. */}
                       <div className="flex items-center justify-center p-4">
                         <Badge variant="outline" className="text-xs text-muted-foreground">
                           Messages History ({selectedTicket._count?.messages || 0})
                         </Badge>
                       </div>
                    </div>
                 </ScrollArea>
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
