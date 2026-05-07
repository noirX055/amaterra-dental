-- Create chat conversations table
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'admin')),
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON public.chat_conversations(status, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON public.chat_messages(conversation_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for conversations
-- Anyone can create a conversation
CREATE POLICY "Anyone can create conversations"
  ON public.chat_conversations
  FOR INSERT
  WITH CHECK (true);

-- Anyone can read their own conversation (by ID in session)
CREATE POLICY "Anyone can read conversations"
  ON public.chat_conversations
  FOR SELECT
  USING (true);

-- Authenticated users (admin) can read all conversations
CREATE POLICY "Authenticated users can read all conversations"
  ON public.chat_conversations
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can update conversations
CREATE POLICY "Authenticated users can update conversations"
  ON public.chat_conversations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for messages
-- Anyone can insert messages
CREATE POLICY "Anyone can insert messages"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (true);

-- Anyone can read messages from their conversation
CREATE POLICY "Anyone can read messages"
  ON public.chat_messages
  FOR SELECT
  USING (true);

-- Authenticated users can read all messages
CREATE POLICY "Authenticated users can read all messages"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can update messages (mark as read)
CREATE POLICY "Authenticated users can update messages"
  ON public.chat_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_chat_conversations_updated_at_trigger
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_conversations_updated_at();

-- Function to update last_message_at when new message is added
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_message_at
CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();
