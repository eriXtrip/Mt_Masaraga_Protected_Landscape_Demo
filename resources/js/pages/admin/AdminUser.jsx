import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useAdminStore, createUser, updateUser, deleteUser } from '../../state/adminStore';
import { Button } from '@/components/ui/button';
import { toast } from '../../components/ui/toast';
import UserSummary from '../../components/admin/user/UserSummary';
import UserFilters from '../../components/admin/user/UserFilters';
import UserList from '../../components/admin/user/UserList';
import UserForm from '../../components/admin/user/UserForm';

export default function AdminUser() {
    const { users } = useAdminStore();
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [editingUser, setEditingUser] = useState(null);

    const filteredUsers = users.filter((user) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            !term ||
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.subtitle.toLowerCase().includes(term);
        const matchesRole = roleFilter === 'All' || (user.role === 1 && roleFilter === 'Admin') || (user.role === 2 && roleFilter === 'Staff') || (user.role === 3 && roleFilter === 'Hiker');
        const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleToggleStatus = (user) => {
        const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        updateUser(user.id, { status: newStatus });
        toast.add({
            type: 'success',
            title: `User ${newStatus === 'Active' ? 'reactivated' : 'deactivated'}`,
            description: `${user.name} has been ${newStatus === 'Active' ? 'reactivated' : 'deactivated'}.`,
        });
    };

    const handleDelete = (userId) => {
        const user = users.find((u) => u.id === userId);
        deleteUser(userId);
        toast.add({
            type: 'success',
            title: 'User deleted',
            description: `${user?.name || 'User'} has been removed.`,
        });
    };

    const handleSaveUser = (userData, existingId) => {
        if (existingId) {
            updateUser(existingId, userData);
            toast.add({
                type: 'success',
                title: 'User updated',
                description: `${userData.name}'s profile has been updated.`,
            });
        } else {
            createUser(userData);
            toast.add({
                type: 'success',
                title: 'User added',
                description: `${userData.name} has been added to the registry.`,
            });
        }
        setEditingUser(null);
    };

    return (
        <>
            <div ref={sectionRef} className="space-y-6 md:space-y-8">
                <header
                    style={{ transitionDelay: '0ms' }}
                    className={`flex flex-col gap-3 md:flex-row md:items-end md:justify-between transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
                >
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                            Admin Console · Users
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                            Users
                        </h1>
                        <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">
                            Manage admin accounts, staff, and registered hikers.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="h-11! shrink-0 gap-2"
                        onClick={() => setEditingUser({ isNew: true })}
                    >
                        <Plus className="h-4 w-4" />
                        Add User
                    </Button>
                </header>

                <div
                    style={{ transitionDelay: '150ms' }}
                    className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
                >
                    <UserSummary users={users} />
                </div>

                <div
                    style={{ transitionDelay: '250ms' }}
                    className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
                >
                    <UserList
                        users={filteredUsers}
                        onCreate={() => setEditingUser({ isNew: true })}
                        onEdit={setEditingUser}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                    />
                </div>
            </div>

            {editingUser && (
                <UserForm
                    user={editingUser.isNew ? null : editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSaveUser}
                />
            )}
        </>
    );
}
