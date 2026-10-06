import React, { useState, useMemo } from 'react';
import { Plus, Loader2, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserCard from './UserCard';
import UserFilters from './UserFilters';

const DEFAULT_FILTERS = {
    search: '',
    role: 'All',
    status: 'All',
};

function filterUsers(users, filters) {
    return users.filter((user) => {
        const matchesSearch = !filters.search ||
            user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
            user.subtitle.toLowerCase().includes(filters.search.toLowerCase());
        const matchesRole = filters.role === 'All' || (user.role === 1 && filters.role === 'Admin') || (user.role === 2 && filters.role === 'Staff') || (user.role === 3 && filters.role === 'Hiker');
        const matchesStatus = filters.status === 'All' || user.status === filters.status;
        return matchesSearch && matchesRole && matchesStatus;
    });
}

export default function UserList({ users, onCreate, onEdit, onDelete, onToggleStatus }) {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [isLoading] = useState(false);

    const filteredUsers = useMemo(() => filterUsers(users, filters), [users, filters]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    const hasActiveFilters = filters.search || filters.role !== 'All' || filters.status !== 'All';

    return (
        <div className="space-y-6">
            <UserFilters
                searchTerm={filters.search}
                roleFilter={filters.role}
                statusFilter={filters.status}
                resultCount={filteredUsers.length}
                totalCount={users.length}
                onSearch={(v) => handleFilterChange('search', v)}
                onRole={(v) => handleFilterChange('role', v)}
                onStatus={(v) => handleFilterChange('status', v)}
                onClear={handleClearFilters}
            />

            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {!isLoading && filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <UserCog className="h-12 w-12 text-on-surface-variant/30" />
                    <h3 className="mt-4 text-lg font-semibold text-on-surface">No users found</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                        {hasActiveFilters ? 'Try adjusting your filters' : 'Create your first user to get started'}
                    </p>
                    {!hasActiveFilters && (
                        <Button variant="default" size="lg" className="mt-4 gap-2 cursor-pointer" onClick={() => onCreate?.()}>
                            <Plus className="h-4 w-4" /> Add User
                        </Button>
                    )}
                </div>
            )}

            {!isLoading && filteredUsers.length > 0 && (
                <div className="space-y-4">
                    <div className="text-sm text-on-surface-variant">
                        Showing <strong className="text-on-surface font-bold">{filteredUsers.length}</strong> of {users.length} {filteredUsers.length !== 1 ? 'users' : 'user'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={(u) => onEdit?.(u)}
                                onDelete={(id) => onDelete?.(id)}
                                onToggleStatus={(u) => onToggleStatus?.(u)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
