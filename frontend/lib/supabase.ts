import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session, User } from '@supabase/supabase-js';

export const supabase = createClientComponentClient();

export type { Session, User };
