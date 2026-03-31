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
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Download,
  Filter,
} from "lucide-react";

interface Incident {
  id: string;
  reportNumber: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Submitted" | "Under Review" | "Resolved" | "Closed";
  location: string;
  reportedBy: string;
  date: string;
  description: string;
}

const mockIncidents: Incident[] = [
  {
    id: "1",
    reportNumber: "2024-0001",
    type: "Road Accident",
    severity: "Critical",
    status: "Under Review",
    location: "Highway 5, KM 12",
    reportedBy: "John Doe",
    date: "2024-03-20",
    description: "Multi-vehicle collision on highway",
  },
  {
    id: "2",
    reportNumber: "2024-0002",
    type: "Medical Emergency",
    severity: "High",
    status: "Resolved",
    location: "Downtown Medical Center",
    reportedBy: "Jane Smith",
    date: "2024-03-19",
    description: "Heart attack victim, emergency response",
  },
  {
    id: "3",
    reportNumber: "2024-0003",
    type: "Fire Accident",
    severity: "High",
    status: "Resolved",
    location: "Industrial Zone",
    reportedBy: "Bob Johnson",
    date: "2024-03-18",
    description: "Factory fire, controlled and extinguished",
  },
  {
    id: "4",
    reportNumber: "2024-0004",
    type: "Building Collapse",
    severity: "Critical",
    status: "Under Review",
    location: "Downtown District",
    reportedBy: "Alice Brown",
    date: "2024-03-17",
    description: "Partial building collapse, rescue ongoing",
  },
  {
    id: "5",
    reportNumber: "2024-0005",
    type: "Motorcycle Accident",
    severity: "Medium",
    status: "Submitted",
    location: "City Center",
    reportedBy: "Charlie Wilson",
    date: "2024-03-16",
    description: "Single motorcycle accident, victim hospitalized",
  },
];

const IncidentsManagementPage = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Incident>>({
    reportNumber: "",
    type: "Road Accident",
    severity: "High",
    status: "Submitted",
    location: "",
    reportedBy: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.reportNumber.includes(searchQuery) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.reportedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || incident.status === filterStatus;
    const matchesSeverity =
      filterSeverity === "all" || incident.severity === filterSeverity;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      reportNumber: `2024-${String(incidents.length + 1).padStart(4, "0")}`,
      type: "Road Accident",
      severity: "High",
      status: "Submitted",
      location: "",
      reportedBy: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (incident: Incident) => {
    setEditingId(incident.id);
    setFormData(incident);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.location?.trim() || !formData.reportedBy?.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingId) {
      setIncidents(
        incidents.map((inc) =>
          inc.id === editingId ? { ...inc, ...(formData as Incident) } : inc,
        ),
      );
      toast.success("Incident updated successfully");
    } else {
      const newIncident: Incident = {
        id: String(incidents.length + 1),
        ...(formData as Incident),
      };
      setIncidents([...incidents, newIncident]);
      toast.success("Incident created successfully");
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setIncidents(incidents.filter((inc) => inc.id !== id));
    toast.success("Incident deleted successfully");
  };

  const currentIncident = incidents.find((inc) => inc.id === viewingId);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-blue-100 text-teal-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-purple-100 text-purple-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">
            Incidents Management
          </h1>
          <p className="text-slate-400 mt-1">
            View, manage, and perform CRUD operations on incidents
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-slate-50">
                {editingId ? "Edit Incident" : "Add New Incident"}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {editingId
                  ? "Update the incident details below"
                  : "Create a new incident report"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Report Number</Label>
                  <Input
                    value={formData.reportNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, reportNumber: e.target.value })
                    }
                    disabled
                    className="mt-1 bg-slate-800 border-slate-700 text-slate-50"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Date</Label>
                  <Input
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="mt-1 bg-slate-800 border-slate-700 text-slate-50"
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Type</Label>
                <Select
                  value={formData.type || "Road Accident"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    <SelectItem value="Road Accident">Road Accident</SelectItem>
                    <SelectItem value="Fire Accident">Fire Accident</SelectItem>
                    <SelectItem value="Medical Emergency">
                      Medical Emergency
                    </SelectItem>
                    <SelectItem value="Building Collapse">
                      Building Collapse
                    </SelectItem>
                    <SelectItem value="Industrial Accident">
                      Industrial Accident
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Severity</Label>
                  <Select
                    value={formData.severity || "High"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, severity: value as any })
                    }
                  >
                    <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">Status</Label>
                  <Select
                    value={formData.status || "Submitted"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value as any })
                    }
                  >
                    <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Location</Label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Enter incident location"
                  className="mt-1 bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                />
              </div>

              <div>
                <Label className="text-slate-300">Reported By</Label>
                <Input
                  value={formData.reportedBy || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, reportedBy: e.target.value })
                  }
                  placeholder="Enter reporter name"
                  className="mt-1 bg-slate-800 border-slate-700 text-slate-50 placeholder-slate-500"
                />
              </div>

              <div>
                <Label className="text-slate-300">Description</Label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter incident description"
                  className="w-full p-2 border border-slate-700 rounded-md mt-1 text-sm bg-slate-800 text-slate-50 placeholder-slate-500"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingId ? "Update" : "Create"} Incident
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs">Search</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by report # or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Severity</Label>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incidents Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-slate-50">Incidents</CardTitle>
              <CardDescription className="text-slate-400">
                Total: {filteredIncidents.length} incident(s)
              </CardDescription>
            </div>
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-slate-400">No incidents found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">
                        {incident.reportNumber}
                      </TableCell>
                      <TableCell>{incident.type}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {incident.location}
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(incident.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingId(incident.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleEdit(incident);
                              setIsDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(incident.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
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

      {/* View Modal */}
      {currentIncident && (
        <Dialog open={!!viewingId} onOpenChange={() => setViewingId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Incident Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Report Number
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    {currentIncident.reportNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Date</p>
                  <p className="text-sm font-semibold mt-1">
                    {new Date(currentIncident.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Description
                </p>
                <p className="text-sm mt-1 text-slate-700">
                  {currentIncident.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Type</p>
                  <p className="text-sm font-semibold mt-1">
                    {currentIncident.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Location</p>
                  <p className="text-sm font-semibold mt-1">
                    {currentIncident.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Severity</p>
                  <Badge
                    className={`mt-1 ${getSeverityColor(currentIncident.severity)}`}
                  >
                    {currentIncident.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Status</p>
                  <Badge
                    className={`mt-1 ${getStatusColor(currentIncident.status)}`}
                  >
                    {currentIncident.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Reported By
                </p>
                <p className="text-sm font-semibold mt-1">
                  {currentIncident.reportedBy}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default IncidentsManagementPage;
