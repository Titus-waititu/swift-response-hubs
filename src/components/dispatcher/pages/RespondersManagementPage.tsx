import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Label } from "../../ui/label";
import {
  Users,
  Search,
  Phone,
  MapPin,
  Clock,
  Send,
  MapIcon,
} from "lucide-react";
import { toast } from "sonner";

interface Responder {
  id: string;
  name: string;
  role: "ambulance" | "fire" | "police";
  phone: string;
  location: string;
  status: "available" | "en-route" | "on-scene" | "unavailable";
  currentAssignment?: string;
  estimatedAvailable?: string;
}

interface RespondersManagementPageProps {
  incidents?: any[];
}

export default function RespondersManagementPage({}: RespondersManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dispatchingTo, setDispatchingTo] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<string>("");

  // Mock data - replace with API calls
  const responders: Responder[] = [
    {
      id: "r1",
      name: "John Davidson",
      role: "ambulance",
      phone: "+1234567890",
      location: "Station 5, Downtown",
      status: "available",
    },
    {
      id: "r2",
      name: "Maria Santos",
      role: "ambulance",
      phone: "+1234567891",
      location: "Central Hospital",
      status: "on-scene",
      currentAssignment: "Accident #2024-0451",
      estimatedAvailable: "15 mins",
    },
    {
      id: "r3",
      name: "James Wilson",
      role: "fire",
      phone: "+1234567892",
      location: "Fire Station 2",
      status: "available",
    },
    {
      id: "r4",
      name: "Sarah Chen",
      role: "police",
      phone: "+1234567893",
      location: "Downtown Precinct",
      status: "en-route",
      currentAssignment: "Traffic Control #2024-0452",
      estimatedAvailable: "8 mins",
    },
  ];

  const filteredResponders = responders.filter((responder) => {
    const matchesSearch =
      responder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      responder.phone.includes(searchQuery);
    const matchesRole = roleFilter === "all" || responder.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || responder.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-900 text-green-200";
      case "en-route":
        return "bg-blue-900 text-blue-200";
      case "on-scene":
        return "bg-orange-900 text-orange-200";
      case "unavailable":
        return "bg-red-900 text-red-200";
      default:
        return "bg-slate-900 text-slate-200";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ambulance":
        return "text-blue-400";
      case "fire":
        return "text-orange-400";
      case "police":
        return "text-purple-400";
      default:
        return "text-slate-400";
    }
  };

  const handleDispatch = (responderId: string) => {
    if (!selectedIncident) {
      toast.error("Please select an incident to dispatch");
      return;
    }
    toast.success(`Dispatching responder to incident ${selectedIncident}`);
    setDispatchingTo(null);
    setSelectedIncident("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-2">
          <Users className="h-7 w-7" />
          Responders Management
        </h1>
        <p className="text-slate-400 mt-1">
          Manage and dispatch emergency responders in real-time
        </p>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-slate-300 mb-2 block text-sm">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search by name or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-slate-50"
            />
          </div>
        </div>
        <div>
          <Label className="text-slate-300 mb-2 block text-sm">Role</Label>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ambulance">Ambulance</SelectItem>
              <SelectItem value="fire">Fire</SelectItem>
              <SelectItem value="police">Police</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-slate-300 mb-2 block text-sm">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="en-route">En Route</SelectItem>
              <SelectItem value="on-scene">On Scene</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Responders Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-50">Active Responders</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredResponders.length} responder(s) available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-700/50">
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Role</TableHead>
                  <TableHead className="text-slate-300">Location</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Contact</TableHead>
                  <TableHead className="text-slate-300">
                    Current Assignment
                  </TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponders.map((responder) => (
                  <TableRow
                    key={responder.id}
                    className="border-slate-700 hover:bg-slate-700/50"
                  >
                    <TableCell className="text-slate-100 font-medium">
                      {responder.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`capitalize ${getRoleColor(responder.role)}`}
                      >
                        {responder.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-300 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      {responder.location}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(responder.status)}>
                        {responder.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300 flex items-center gap-1">
                      <Phone className="h-4 w-4 text-slate-500" />
                      {responder.phone}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {responder.currentAssignment ? (
                        <div className="text-sm">
                          <p className="font-medium">
                            {responder.currentAssignment}
                          </p>
                          {responder.estimatedAvailable && (
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Available in {responder.estimatedAvailable}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={dispatchingTo === responder.id}
                        onOpenChange={(open) => {
                          if (open) setDispatchingTo(responder.id);
                          else setDispatchingTo(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1"
                            disabled={responder.status !== "available"}
                          >
                            <Send className="h-3 w-3" />
                            Dispatch
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-slate-50">
                              Dispatch {responder.name}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Select an incident to dispatch this responder to
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-slate-300">
                                Select Incident
                              </Label>
                              <Select
                                value={selectedIncident}
                                onValueChange={setSelectedIncident}
                              >
                                <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50 mt-2">
                                  <SelectValue placeholder="Choose incident..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="INC-2024-0451">
                                    #2024-0451 - Multi-vehicle collision
                                  </SelectItem>
                                  <SelectItem value="INC-2024-0452">
                                    #2024-0452 - Medical emergency
                                  </SelectItem>
                                  <SelectItem value="INC-2024-0453">
                                    #2024-0453 - Structure fire
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              className="w-full bg-teal-700 hover:bg-teal-800 text-white"
                              onClick={() => handleDispatch(responder.id)}
                            >
                              Send Dispatch
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-50">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button className="bg-blue-700 hover:bg-blue-800 text-white w-full flex items-center gap-2">
            <MapIcon className="h-4 w-4" />
            View All on Map
          </Button>
          <Button className="bg-purple-700 hover:bg-purple-800 text-white w-full flex items-center gap-2">
            <Users className="h-4 w-4" />
            Broadcast Alert
          </Button>
          <Button className="bg-green-700 hover:bg-green-800 text-white w-full flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Call Station
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
