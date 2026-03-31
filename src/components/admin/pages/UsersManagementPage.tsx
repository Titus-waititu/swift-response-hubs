import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, Shield, Mail, Power } from "lucide-react";
import {
  useGetUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
} from "@/hooks/useUsers";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OFFICER" | "RESPONDER" | "USER";
  status: "Active" | "Inactive";
  createdDate: string;
  lastLogin?: string;
}

const UsersManagementPage = () => {
  // Fetch users from backend
  const { data: usersData, isLoading, error: usersError } = useGetUsers();
  const users = Array.isArray(usersData) ? usersData : usersData?.data || [];

  // API mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "OFFICER",
    status: "Active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      role: "OFFICER",
      status: "Active",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData(user);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim() || !formData.email?.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // Update user via API
        await updateUserMutation.mutateAsync({
          id: editingId,
          data: {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status,
          },
        });
        toast.success("User updated successfully");
      } else {
        // Create new user via API
        await createUserMutation.mutateAsync({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: "TempPassword123!", // Backend should handle this
        });
        toast.success("User created successfully");
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUserMutation.mutateAsync(id);
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const user = users.find((u) => u.id === id);
      if (!user) return;

      if (user.status === "Active") {
        await deactivateUserMutation.mutateAsync(id);
        toast.success("User deactivated successfully");
      } else {
        await activateUserMutation.mutateAsync(id);
        toast.success("User activated successfully");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update user status");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "OFFICER":
        return "bg-blue-100 text-blue-800";
      case "RESPONDER":
        return "bg-green-100 text-green-800";
      case "USER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {usersError && (
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="pt-6">
            <div className="text-red-200">
              <p className="font-semibold">Error loading users</p>
              <p className="text-sm mt-1">
                {usersError?.message || "Failed to fetch users from backend. Please check the server logs."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Users Management</h1>
          <p className="text-slate-400 mt-1">
            Create, edit, and manage user accounts
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-slate-50">
                {editingId ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {editingId
                  ? "Update user information"
                  : "Create a new user account"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div>
                <Label className="text-slate-300">Full Name</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="mt-1 bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                />
              </div>

              <div>
                <Label className="text-slate-300">Email</Label>
                <Input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter email address"
                  className="mt-1 bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                />
              </div>

              <div>
                <Label className="text-slate-300">Role</Label>
                <Select
                  value={formData.role || "OFFICER"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value as any })
                  }
                >
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="OFFICER">Officer</SelectItem>
                    <SelectItem value="RESPONDER">Responder</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Status</Label>
                <Select
                  value={formData.status || "Active"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as any })
                  }
                >
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingId ? "Update User" : "Create User"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-50">{users.length}</p>
              <p className="text-sm text-slate-400 mt-1">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {users.filter((u) => u.role === "OFFICER").length}
              </p>
              <p className="text-sm text-slate-400 mt-1">Officers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {users.filter((u) => u.role === "RESPONDER").length}
              </p>
              <p className="text-sm text-slate-400 mt-1">Responders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">
                {users.filter((u) => u.status === "Active").length}
              </p>
              <p className="text-sm text-slate-400 mt-1">Active</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs">Search</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-300">Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="OFFICER">Officer</SelectItem>
                  <SelectItem value="RESPONDER">Responder</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-slate-50">Users</CardTitle>
              <CardDescription className="text-slate-400">
                Total: {filteredUsers.length} user(s)
              </CardDescription>
            </div>
            <Shield className="h-4 w-4 text-slate-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-slate-400">Loading users...</p>
                    </TableCell>
                  </TableRow>
                ) : usersError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-red-400">
                        <p className="font-semibold">Failed to load users</p>
                        <p className="text-xs mt-1">{usersError?.message || "Backend error: Check console"}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-slate-400">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(user.createdDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleEdit(user);
                              setIsDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id)}
                            className="h-8 px-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 flex items-center gap-1 text-xs"
                            title={
                              user.status === "Active"
                                ? "Deactivate user"
                                : "Activate user"
                            }
                          >
                            <Power className="h-3 w-3" />
                            {user.status === "Active"
                              ? "Deactivate"
                              : "Activate"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-slate-700"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagementPage;
