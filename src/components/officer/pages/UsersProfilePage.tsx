import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock users data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "OFFICER",
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "RESPONDER",
    status: "Active",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@example.com",
    role: "USER",
    status: "Inactive",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "ADMIN",
    status: "Active",
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    name: "Tom Brown",
    email: "tom@example.com",
    role: "RESPONDER",
    status: "Active",
    createdAt: "2024-03-01",
  },
];

export default function UsersProfilePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100";
      case "OFFICER":
        return "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100";
      case "RESPONDER":
        return "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100";
      case "USER":
        return "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100";
      default:
        return "bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100";
      case "Inactive":
        return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
      default:
        return "bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Users Profile
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          View all system users (read-only access)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Total Users
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                {mockUsers.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Active Users
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                {mockUsers.filter((u) => u.status === "Active").length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Officers
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                {mockUsers.filter((u) => u.role === "OFFICER").length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Responders
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                {mockUsers.filter((u) => u.role === "RESPONDER").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300 text-sm mb-2 block">
                Search
              </Label>
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 placeholder-slate-500"
              />
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300 text-sm mb-2 block">
                Role
              </Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="OFFICER">Officer</SelectItem>
                  <SelectItem value="RESPONDER">Responder</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300 text-sm mb-2 block">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Users List ({filteredUsers.length})
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Read-only access to user profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Name
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Email
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Role
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Status
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Created At
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400">
                        No users found
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-slate-50">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {user.email}
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
                      <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Note */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            <span className="font-semibold text-slate-900 dark:text-slate-300">
              Note:
            </span>{" "}
            As an officer, you have read-only access to user profiles. You
            cannot create, edit, or delete users. Contact your administrator for
            user management operations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
