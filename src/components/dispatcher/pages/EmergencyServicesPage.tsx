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
import { Label } from "../../ui/label";
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
import { Ambulance, Plus, Search, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

interface EmergencyService {
  id: string;
  name: string;
  type: "ambulance" | "fire" | "police" | "hazmat";
  location: string;
  phone: string;
  status: "active" | "busy" | "offline";
  responseTime: number;
  units: number;
  coverage: string;
}

export default function EmergencyServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    type: "ambulance" as const,
    location: "",
    phone: "",
  });

  // Mock data - replace with API calls
  const services: EmergencyService[] = [
    {
      id: "s1",
      name: "Central Ambulance Station",
      type: "ambulance",
      location: "Downtown Medical District",
      phone: "+1-555-0101",
      status: "active",
      responseTime: 4,
      units: 8,
      coverage: "15 sq miles",
    },
    {
      id: "s2",
      name: "Fire Station 2",
      type: "fire",
      location: "Eastside Industrial",
      phone: "+1-555-0102",
      status: "active",
      responseTime: 6,
      units: 5,
      coverage: "20 sq miles",
    },
    {
      id: "s3",
      name: "Police Precinct 5",
      type: "police",
      location: "Central District",
      phone: "+1-555-0103",
      status: "active",
      responseTime: 3,
      units: 12,
      coverage: "25 sq miles",
    },
    {
      id: "s4",
      name: "Hazmat Response Team",
      type: "hazmat",
      location: "Chemical Storage Facility",
      phone: "+1-555-0104",
      status: "busy",
      responseTime: 12,
      units: 2,
      coverage: "50 sq miles",
    },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || service.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || service.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-900 text-green-200";
      case "busy":
        return "bg-orange-900 text-orange-200";
      case "offline":
        return "bg-red-900 text-red-200";
      default:
        return "bg-slate-900 text-slate-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ambulance":
        return "🚑";
      case "fire":
        return "🚒";
      case "police":
        return "🚔";
      case "hazmat":
        return "⚠️";
      default:
        return "📍";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ambulance":
        return "text-blue-400";
      case "fire":
        return "text-orange-400";
      case "police":
        return "text-purple-400";
      case "hazmat":
        return "text-yellow-400";
      default:
        return "text-slate-400";
    }
  };

  const handleAddService = () => {
    if (!newService.name || !newService.location || !newService.phone) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success(`Emergency service "${newService.name}" added successfully`);
    setIsAddingService(false);
    setNewService({
      name: "",
      type: "ambulance",
      location: "",
      phone: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-2">
            <Ambulance className="h-7 w-7" />
            Emergency Services
          </h1>
          <p className="text-slate-400 mt-1">
            Manage emergency service providers and their status
          </p>
        </div>
        <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
          <DialogTrigger asChild>
            <Button className="bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-50">
                Add Emergency Service
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Register a new emergency service provider
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Service Name</Label>
                <Input
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                  placeholder="e.g., Central Ambulance Station"
                  className="bg-slate-900 border-slate-700 text-slate-50 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300">Service Type</Label>
                <Select
                  value={newService.type}
                  onValueChange={(value: any) =>
                    setNewService({ ...newService, type: value })
                  }
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambulance">Ambulance</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                    <SelectItem value="hazmat">Hazmat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300">Location</Label>
                <Input
                  value={newService.location}
                  onChange={(e) =>
                    setNewService({ ...newService, location: e.target.value })
                  }
                  placeholder="Service location"
                  className="bg-slate-900 border-slate-700 text-slate-50 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-300">Phone Number</Label>
                <Input
                  value={newService.phone}
                  onChange={(e) =>
                    setNewService({ ...newService, phone: e.target.value })
                  }
                  placeholder="+1-555-0000"
                  className="bg-slate-900 border-slate-700 text-slate-50 mt-1"
                />
              </div>
              <Button
                className="w-full bg-teal-700 hover:bg-teal-800 text-white"
                onClick={handleAddService}
              >
                Add Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-slate-300 mb-2 block text-sm">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-slate-50"
            />
          </div>
        </div>
        <div>
          <Label className="text-slate-300 mb-2 block text-sm">Type</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ambulance">Ambulance</SelectItem>
              <SelectItem value="fire">Fire</SelectItem>
              <SelectItem value="police">Police</SelectItem>
              <SelectItem value="hazmat">Hazmat</SelectItem>
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white">
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Services Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-50">Service Providers</CardTitle>
          <CardDescription className="text-slate-400">
            {filteredServices.length} service(s) registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-700/50">
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Location</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">
                    Response Time
                  </TableHead>
                  <TableHead className="text-slate-300">Units</TableHead>
                  <TableHead className="text-slate-300">Coverage</TableHead>
                  <TableHead className="text-slate-300">Contact</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow
                    key={service.id}
                    className="border-slate-700 hover:bg-slate-700/50"
                  >
                    <TableCell className="text-slate-100 font-medium">
                      <span className="mr-2">{getTypeIcon(service.type)}</span>
                      {service.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`capitalize ${getTypeColor(service.type)}`}
                      >
                        {service.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-300 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      {service.location}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300 flex items-center gap-1">
                      <Clock className="h-4 w-4 text-slate-500" />
                      {service.responseTime} min
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {service.units} unit{service.units !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {service.coverage}
                    </TableCell>
                    <TableCell className="text-slate-300 flex items-center gap-1">
                      <Phone className="h-4 w-4 text-slate-500" />
                      {service.phone}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-700 hover:bg-blue-800 text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-slate-50 border-slate-700 hover:bg-slate-700"
                        >
                          Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Services</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {services.length}
                </p>
              </div>
              <div className="text-3xl opacity-20">🏥</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Services</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {services.filter((s) => s.status === "active").length}
                </p>
              </div>
              <div className="text-3xl opacity-20">✅</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Units</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {services.reduce((sum, s) => sum + s.units, 0)}
                </p>
              </div>
              <div className="text-3xl opacity-20">🚑</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Response Time</p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {Math.round(
                    services.reduce((sum, s) => sum + s.responseTime, 0) /
                      services.length,
                  )}{" "}
                  min
                </p>
              </div>
              <div className="text-3xl opacity-20">⏱️</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
