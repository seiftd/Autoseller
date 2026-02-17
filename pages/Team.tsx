import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { securityService } from '../services/securityService';
import { billingService } from '../services/billingService';
import { WorkspaceMember, Language } from '../types';
import { TEXTS } from '../constants';
import { SectionHeader, Badge, EmptyState } from '../components/PremiumUI';
import { Users, UserPlus, Mail, Trash2, Shield, Lock, Crown } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { Link } from 'react-router-dom';

interface Props {
  lang: Language;
}

export const Team: React.FC<Props> = ({ lang }) => {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [role, setRole] = useState<'manager'>('manager');
  const { showToast } = useToast();
  const t = TEXTS;

  const canAccessTeam = billingService.canAccessTeam();
  const planLimits = billingService.getPlanLimits();

  useEffect(() => {
    if (canAccessTeam) {
        loadMembers();
    }
  }, [canAccessTeam]);

  const loadMembers = () => {
    setMembers(storageService.getWorkspaceMembers());
  };

  const handleInvite = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Enforce Member Limit
      // Currently members array + 1 (Owner)
      // Note: members list usually excludes owner in this simple implementation, or we count manually.
      // Assuming members array only contains invitees. Owner is implicitly 1.
      if (members.length + 1 >= planLimits.teamMembers) {
          showToast(`Member limit reached (${planLimits.teamMembers} max). Contact support for Enterprise.`, 'error');
          return;
      }

      const newMember: WorkspaceMember = {
          id: crypto.randomUUID(),
          workspaceId: 'user_123_admin', // current owner ID
          userId: '', // pending accept
          email: inviteEmail,
          name: inviteName,
          role: role,
          status: 'pending',
          invitedAt: Date.now()
      };
      
      storageService.addWorkspaceMember(newMember);
      securityService.logAction('invite_member', newMember.id, { email: inviteEmail, role });
      
      setMembers(prev => [...prev, newMember]);
      setShowInvite(false);
      setInviteEmail('');
      setInviteName('');
      showToast('Invitation sent successfully', 'success');
  };

  const handleRemove = (id: string) => {
      if(confirm('Remove this member?')) {
          storageService.removeWorkspaceMember(id);
          securityService.logAction('remove_member', id);
          loadMembers();
          showToast('Member removed', 'info');
      }
  };

  if (!canAccessTeam) {
      return (
          <div className="space-y-8 animate-fade-in">
              <SectionHeader title={t.team[lang]} />
              <div className="flex flex-col items-center justify-center p-16 text-center bg-slate-800/30 border border-slate-800 border-dashed rounded-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-900/90 z-10 backdrop-blur-[2px]"></div>
                  <div className="relative z-20 flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-xl">
                          <Lock size={32} className="text-yellow-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Team Collaboration is Locked</h2>
                      <p className="text-slate-400 max-w-md mb-8">
                          Team management features are exclusively available on the <strong>Business Plan</strong>. 
                          Invite up to 5 members to manage your store together.
                      </p>
                      <Link 
                          to="/billing" 
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-8 py-3 rounded-xl shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all hover:scale-105"
                      >
                          <Crown size={20} /> Upgrade to Business
                      </Link>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-fade-in">
        <SectionHeader 
            title={t.team[lang]} 
            subtitle={`Manage access (${members.length + 1}/${planLimits.teamMembers} members)`}
            action={
                <button 
                    onClick={() => setShowInvite(!showInvite)}
                    disabled={members.length + 1 >= planLimits.teamMembers}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all"
                >
                    <UserPlus size={18} />
                    {t.invite[lang]}
                </button>
            }
        />

        {showInvite && (
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl animate-fade-in-up">
                <h3 className="text-white font-bold mb-4">Invite New Member</h3>
                <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Email</label>
                        <input required type="email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white" placeholder="colleague@example.com" />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Name</label>
                        <input required type="text" value={inviteName} onChange={e=>setInviteName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white" placeholder="John Doe" />
                    </div>
                    <div className="w-full md:w-40">
                        <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Role</label>
                        <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white" value={role} disabled>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-xl font-bold">Send</button>
                </form>
            </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden">
             {members.length === 0 ? (
                 <EmptyState 
                    icon={Users} 
                    title="No Team Members" 
                    description="Invite your team to collaborate on orders and products." 
                 />
             ) : (
                <div className="divide-y divide-slate-700/50">
                    {members.map(member => (
                        <div key={member.id} className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{member.name}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Mail size={12}/> {member.email}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-end">
                                    <Badge variant={member.status === 'active' ? 'success' : 'warning'}>{member.status}</Badge>
                                    <span className="text-[10px] text-slate-500 mt-1 uppercase font-bold flex items-center gap-1">
                                        <Shield size={10}/> {member.role}
                                    </span>
                                </div>
                                <button onClick={() => handleRemove(member.id)} className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-slate-700/50 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             )}
        </div>
    </div>
  );
};