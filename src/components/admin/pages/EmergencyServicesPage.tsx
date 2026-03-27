import { Phone, MapPin, Activity, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { EmergencyService } from "@/types/api-responses";
import { useState } from "react";

const mockServices: EmergencyService[] = [
  {
    id: "1",
    name: "City Emergency Medical Services",
    type: "ambulance",
    location: "Downtown Station",
    phone: "(555) 123-4567",
    email: "ems@city.gov",
    operationalStatus: "active",
    averageResponseTime: 7.2,
    coverage: { latitude: 40.7128, longitude: -74.006, radiusMiles: 15 },
  },
  {
    id: "2",
    name: "Fire Department - Station 1",
    type: "fire",
    location: "Main Street",
    phone: "(555) 234-5678",
    email: "station1@fire.gov",
    operationalStatus: "active",
    averageResponseTime: 6.8,
    coverage: { latitude: 40.715, longitude: -74.008, radiusMiles: 12 },
  },
  {
    id: "3",
    name: "Police Department - Central",
    type: "police",
    location: "Central Precinct",
    phone: "(555) 345-6789",
    operationalStatus: "busy",
    averageResponseTime: 5.5,
    coverage: { latitude: 40.712, longitude: -74.009, radiusMiles: 10 },
  },
];

interface EmergencyServicesPageProps {
  services?: EmergencyService[];
}

export default function EmergencyServicesPage({
  services = mockServices,
}: EmergencyServicesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || service.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          >
            Active
          </Badge>
        );
      case "busy":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 dark:bg-blue-900/30 text-teal-700 dark:text-teal-400"
          >
            Busy
          </Badge>
        );
      case "offline":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          >
            Offline
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Emergency Services Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage emergency service nodes and contacts
          </p>
        </div>
        <Button className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800">
          + Add Service
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ambulance">Ambulance</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="police">Police</SelectItem>
                <SelectItem value="hazmat">HAZMAT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Registered Services ({filteredServices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Service Name
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Type
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Location
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Contact
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Status
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Avg Response
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
                    className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <TableCell className="font-medium text-slate-900 dark:text-slate-50">
                      {service.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {service.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {service.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                          <Phone className="h-4 w-4" />
                          {service.phone}
                        </div>
                        {service.email && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {service.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(service.operationalStatus)}
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">
                      {service.averageResponseTime.toFixed(1)} min
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          Remove
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

      {/* Coverage Map Info */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Coverage Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900 dark:text-blue-300">
          Each emergency service has defined coverage areas. Dispatch system
          automatically routes incidents to nearest appropriate service within
          coverage radius.
        </CardContent>
      </Card>
    </div>
  );
}
