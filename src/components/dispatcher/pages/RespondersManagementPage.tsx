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
import { Textarea } from "../../ui/textarea";
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
import {
  useGetResponderUsers,
  useDispatchResponder,
  useBroadcastToResponders,
} from "../../../hooks/useResponders";
import { useGetAccidents } from "../../../hooks/useAccidents";

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
  const [showMapModal, setShowMapModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");

  // Fetch responders from API - uses users with EMERGENCY_RESPONDER role
  const {
    data: apiData = [] as any,
    isLoading,
    isError,
    error,
  } = useGetResponderUsers();

  // Fetch incidents from API for dispatch
  const { data: allIncidents = [] as any, isLoading: incidentsLoading } =
    useGetAccidents();

  console.log("All incidents available for dispatch:", allIncidents);

  const dispatchMutation = useDispatchResponder();
  const broadcastMutation = useBroadcastToResponders();

  // Use API data directly - it's already transformed by the hook
  const responders = Array.isArray(apiData) ? apiData : [];

  // Debug logging
  console.log("API Response:", apiData);
  console.log("API isLoading:", isLoading);
  console.log("API isError:", isError);
  if (error) console.log("API error:", error);
  console.log("Responders Array:", responders);
  console.log("Responders Count:", responders.length);

  const filteredResponders = responders.filter((responder) => {
    const matchesSearch =
      (responder.name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ) || (responder.phone || "").includes(searchQuery);
    const matchesRole = roleFilter === "all" || responder.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || responder.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });
  console.log("Filtered Responders:", filteredResponders);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "en-route":
        return "bg-blue-100 text-blue-800";
      case "on-scene":
        return "bg-orange-100 text-orange-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ambulance":
        return "text-blue-600";
      case "fire":
        return "text-orange-600";
      case "police":
        return "text-purple-600";
      default:
        return "text-slate-600";
    }
  };

  const handleDispatch = (responderId: string) => {
    if (!selectedIncident) {
      toast.error("Please select an incident to dispatch");
      return;
    }

    // Find the selected incident data
    const incident = allIncidents.find(
      (inc: any) => inc.id === selectedIncident,
    );
    if (!incident) {
      toast.error("Incident data not found");
      return;
    }

    console.log("handleDispatch called with:", {
      responderId,
      selectedIncident,
      incidentData: incident,
    });

    dispatchMutation.mutate(
      {
        responderId,
        incidentId: selectedIncident,
        incidentData: incident,
      },
      {
        onSuccess: () => {
          toast.success(`Dispatching responder to incident`);
          setDispatchingTo(null);
          setSelectedIncident("");
        },
        onError: (error: any) => {
          console.error("Dispatch error in handler:", error);
          const errorMessage =
            error?.response?.data?.message?.join(", ") ||
            error?.response?.data?.message ||
            error?.message ||
            "Failed to dispatch responder";
          toast.error(errorMessage);
        },
      },
    );
  };

  const handleViewOnMap = () => {
    if (filteredResponders.length === 0) {
      toast.error("No responders to display on map");
      return;
    }

    // For now, show a basic toast with responder count
    // In production, this would open a map interface with responder locations
    setShowMapModal(true);
    toast.info(`Showing ${filteredResponders.length} responder(s) on map`);
  };

  const handleBroadcastAlert = () => {
    setShowBroadcastModal(true);
  };

  const sendBroadcast = () => {
    if (!broadcastMessage.trim()) {
      toast.error("Please enter a message to broadcast");
      return;
    }

    broadcastMutation.mutate(
      { title: broadcastMessage },
      {
        onSuccess: () => {
          toast.success(
            `Broadcast alert sent to ${filteredResponders.length} responder(s)`,
          );
          setBroadcastMessage("");
          setShowBroadcastModal(false);
        },
        onError: (error: any) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to send broadcast";
          toast.error(errorMsg);
        },
      },
    );
  };

  const handleCallStation = () => {
    const googleMapsUrl = "tel:911";
    window.open(googleMapsUrl);
    toast.success("Opening phone dialer to contact station");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <Users className="h-7 w-7" />
          Responders Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Manage and dispatch emergency responders in real-time
        </p>
      </div>

      {/* Error State */}
      {isError && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-800 dark:text-red-200">
              <strong>Unable to fetch responders:</strong>{" "}
              {error?.message ||
                "The server returned an error. Trying fallback endpoint..."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-slate-700 dark:text-slate-300 mb-2 block text-sm">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Search by name or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50"
            />
          </div>
        </div>
        <div>
          <Label className="text-slate-700 dark:text-slate-300 mb-2 block text-sm">
            Role
          </Label>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ambulance">Ambulance</SelectItem>
              <SelectItem value="fire">Fire</SelectItem>
              <SelectItem value="police">Police</SelectItem>
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
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="en-route">En Route</SelectItem>
              <SelectItem value="on-scene">On Scene</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white">
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Responders Table */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Active Responders
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {filteredResponders.length} responder(s) available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent"></div>
              <span className="ml-3 text-slate-600 dark:text-slate-400">
                Loading responders...
              </span>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <p className="text-red-800 dark:text-red-200 font-medium">
                Failed to load responders
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                {error?.message ||
                  "An error occurred while fetching responders. Please try refreshing."}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && responders.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  No responders found
                </p>
                <p className="text-slate-500 dark:text-slate-500 text-sm">
                  No users with responder role exist yet
                </p>
              </div>
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && responders.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Name
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Role
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Location
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Status
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Contact
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Current Assignment
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponders.map((responder) => (
                    <TableRow
                      key={responder.id}
                      className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <TableCell className="text-slate-900 dark:text-slate-50 font-medium">
                        {responder.name}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`capitalize ${getRoleColor(responder.role)}`}
                        >
                          {responder.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        {responder.location}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(responder.status)}>
                          {responder.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        {responder.phone}
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {responder.currentAssignment ? (
                          <div className="text-sm">
                            <p className="font-medium">
                              {responder.currentAssignment}
                            </p>
                            {responder.estimatedAvailable && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Available in {responder.estimatedAvailable}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">
                            None
                          </span>
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
                              className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white flex items-center gap-1"
                              disabled={responder.status !== "available"}
                            >
                              <Send className="h-3 w-3" />
                              Dispatch
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <DialogHeader>
                              <DialogTitle className="text-slate-900 dark:text-slate-50">
                                Dispatch {responder.name}
                              </DialogTitle>
                              <DialogDescription className="text-slate-600 dark:text-slate-400">
                                Select an incident to dispatch this responder to
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-slate-700 dark:text-slate-300">
                                  Select Incident
                                </Label>
                                <Select
                                  value={selectedIncident}
                                  onValueChange={setSelectedIncident}
                                >
                                  <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 mt-2">
                                    <SelectValue placeholder="Choose incident..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                                    {incidentsLoading ? (
                                      <SelectItem value="">
                                        Loading incidents...
                                      </SelectItem>
                                    ) : allIncidents &&
                                      allIncidents.length > 0 ? (
                                      allIncidents.map((incident: any) => (
                                        <SelectItem
                                          key={incident.id}
                                          value={incident.id}
                                        >
                                          #{incident.number || incident.id} -{" "}
                                          {incident.type || "Incident"} (
                                          {incident.status || "pending"})
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="">
                                        No incidents available
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white"
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
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={handleViewOnMap}
            className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white w-full flex items-center gap-2"
          >
            <MapIcon className="h-4 w-4" />
            View All on Map
          </Button>
          <Dialog
            open={showBroadcastModal}
            onOpenChange={setShowBroadcastModal}
          >
            <Button
              onClick={() => setShowBroadcastModal(true)}
              className="bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 text-white w-full flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Broadcast Alert
            </Button>
            <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-slate-50">
                  Broadcast Alert
                </DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400">
                  Send an alert to all available responders
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="message"
                    className="text-slate-700 dark:text-slate-300 mb-2 block"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Enter alert message..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 min-h-24"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowBroadcastModal(false)}
                    className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={sendBroadcast}
                    className="bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                  >
                    Send Broadcast
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            onClick={handleCallStation}
            className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white w-full flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            Call Station
          </Button>
        </CardContent>
      </Card>

      {/* Map Modal */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-50">
              Responders Map View
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              View all responders and their real-time locations
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-96 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <div className="text-center">
              <MapIcon className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
              <p className="text-slate-600 dark:text-slate-400">
                Map integration coming soon
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {filteredResponders.length} responders tracked
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
