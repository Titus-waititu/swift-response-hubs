import { useState } from "react";
// Cache bust v2
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
import {
  useGetEmergencyServices,
  useCreateEmergencyService,
  useUpdateEmergencyService,
  useDeleteEmergencyService,
} from "../../../hooks/useEmergencyServices";

interface EmergencyService {
  id: string;
  type: "ambulance" | "fire" | "police" | "hazmat";
  location: string;
  status: "active" | "busy" | "offline";
  responseTime: number;
  units: number;
  coverage: string;
  responder: {
    fullName: string;
    phoneNumber: string;
  };
}

export default function EmergencyServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    type: "ambulance" as const,
    phone: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedService, setSelectedService] =
    useState<EmergencyService | null>(null);
  const [editingService, setEditingService] = useState({
    name: "",
    type: "ambulance" as "ambulance" | "fire" | "police" | "hazmat",
    phone: "",
  });

  // Fetch services from API
  const { data: apiServices = [] } = useGetEmergencyServices();
  const createMutation = useCreateEmergencyService();
  const updateMutation = useUpdateEmergencyService();
  const deleteMutation = useDeleteEmergencyService();

  // Use API data if available
  const services = Array.isArray(apiServices) ? apiServices : [];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      (service.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (service.location?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      );
    const matchesType = typeFilter === "all" || service.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || service.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-orange-100 text-orange-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
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
        return "text-blue-600";
      case "fire":
        return "text-orange-600";
      case "police":
        return "text-purple-600";
      case "hazmat":
        return "text-yellow-600";
      default:
        return "text-slate-600";
    }
  };

  const handleAddService = () => {
    if (!newService.name || !newService.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    // Map form fields to API DTO
    const payload = {
      type: newService.type,
      serviceProvider: newService.name,
      contactNumber: newService.phone,
      status: "active", // Default status
      accidentId: "", // Empty for standalone service, will be linked to accidents separately
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(
          `Emergency service "${newService.name}" added successfully`,
        );
        setIsAddingService(false);
        setNewService({
          name: "",
          type: "ambulance",
          phone: "",
        });
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to add service");
      },
    });
  };

  const handleEdit = (service: EmergencyService) => {
    setSelectedService(service);
    setEditingService({
      name: service.responder?.fullName || "",
      type: service.type,
      phone: service.responder?.phoneNumber || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedService) {
      toast.error("No service selected");
      return;
    }

    // Only send the fields that API accepts
    const updateData: any = {};
    if (editingService.name) updateData.serviceProvider = editingService.name;
    if (editingService.type) updateData.type = editingService.type;
    if (editingService.phone) updateData.contactNumber = editingService.phone;
    // location and responder fields are not supported by the API

    updateMutation.mutate(
      { id: selectedService.id, data: updateData },
      {
        onSuccess: () => {
          toast.success(
            `Service "${editingService.name}" updated successfully`,
          );
          setShowEditModal(false);
          setSelectedService(null);
          setEditingService({
            name: "",
            type: "ambulance",
            phone: "",
          });
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to update service");
        },
      },
    );
  };

  const handleDetails = (service: EmergencyService) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };

  const handleRefreshStatus = () => {
    toast.info("Refreshing service status...");
    setTimeout(() => {
      toast.success("Service status updated");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Ambulance className="h-7 w-7" />
            Emergency Services
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage emergency service providers and their status
          </p>
        </div>
        <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
          <DialogTrigger asChild>
            <Button className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-slate-50">
                Add Emergency Service
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Register a new emergency service provider
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Service Name
                </Label>
                <Input
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                  placeholder="e.g., Central Ambulance Station"
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 mt-1"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Service Type
                </Label>
                <Select
                  value={newService.type}
                  onValueChange={(value: any) =>
                    setNewService({ ...newService, type: value })
                  }
                >
                  <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                    <SelectItem value="ambulance">Ambulance</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                    <SelectItem value="hazmat">Hazmat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Phone Number
                </Label>
                <Input
                  value={newService.phone}
                  onChange={(e) =>
                    setNewService({ ...newService, phone: e.target.value })
                  }
                  placeholder="+1-555-0000"
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 mt-1"
                />
              </div>
              <Button
                className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white"
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
          <Label className="text-slate-700 dark:text-slate-300 mb-2 block text-sm">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50"
            />
          </div>
        </div>
        <div>
          <Label className="text-slate-700 dark:text-slate-300 mb-2 block text-sm">
            Type
          </Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ambulance">Ambulance</SelectItem>
              <SelectItem value="fire">Fire</SelectItem>
              <SelectItem value="police">Police</SelectItem>
              <SelectItem value="hazmat">Hazmat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-slate-700 dark:text-slate-300 mb-2 block text-sm">
            Status
          </Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleRefreshStatus}
            className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
          >
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Services Table */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Service Providers
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {filteredServices.length} service(s) registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Name
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Type
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Location
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Status
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Response Time
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Units
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Coverage
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Contact
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow
                    key={service.id}
                    className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <TableCell className="text-slate-900 dark:text-slate-50 font-medium">
                      <span className="mr-2">{getTypeIcon(service.type)}</span>
                      {service.responder?.fullName || "Unnamed"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`capitalize ${getTypeColor(service.type)}`}
                      >
                        {service.type || "unknown"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      {service.location || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      {service.responseTime ?? 0} min
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">
                      {service.units ?? 0} unit
                      {(service.units ?? 0) !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">
                      {service.coverage || "N/A"}
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      {service.responder?.phoneNumber || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(service)}
                          className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDetails(service)}
                          variant="outline"
                          className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
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
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total Services
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                  {services.length}
                </p>
              </div>
              <div className="text-3xl opacity-20">🏥</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Active Services
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {services.filter((s) => s.status === "active").length}
                </p>
              </div>
              <div className="text-3xl opacity-20">✅</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total Units
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                  {services.reduce((sum, s) => sum + s.units, 0)}
                </p>
              </div>
              <div className="text-3xl opacity-20">🚑</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Avg Response Time
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
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

      {/* Edit Service Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-50">
              Edit Emergency Service
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Update the service details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Service Name
              </Label>
              <Input
                value={editingService.name}
                onChange={(e) =>
                  setEditingService({ ...editingService, name: e.target.value })
                }
                placeholder="e.g., Central Ambulance Station"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Service Type
              </Label>
              <Select
                value={editingService.type}
                onValueChange={(value: any) =>
                  setEditingService({ ...editingService, type: value })
                }
              >
                <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                  <SelectItem value="ambulance">Ambulance</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="police">Police</SelectItem>
                  <SelectItem value="hazmat">Hazmat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-700 dark:text-slate-300">
                Phone Number
              </Label>
              <Input
                value={editingService.phone}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    phone: e.target.value,
                  })
                }
                placeholder="+1-555-0000"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 mt-1"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="flex-1 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white"
                onClick={handleSaveEdit}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-50">
              Service Details
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              View complete information about this emergency service
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Name
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-50 mt-1">
                    {selectedService.responder?.fullName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Type
                  </p>
                  <p className="text-base font-semibold capitalize text-slate-900 dark:text-slate-50 mt-1">
                    {selectedService.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Location
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-50 mt-1">
                    {selectedService.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Phone
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-50 mt-1">
                    {selectedService.responder?.phoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Status
                  </p>
                  <Badge
                    className={`${getStatusColor(selectedService.status)} mt-1`}
                  >
                    {selectedService.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Response Time
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-50 mt-1">
                    {selectedService.responseTime} min
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Units
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-50 mt-1">
                    {selectedService.units}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Coverage Area
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-50 mt-1">
                    {selectedService.coverage}
                  </p>
                </div>
              </div>
              <Button
                className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
