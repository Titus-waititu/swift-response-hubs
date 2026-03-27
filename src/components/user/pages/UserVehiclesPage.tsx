import { useState } from "react";
import { Plus, Edit, Trash2, Car } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserVehicle } from "@/types/api-responses";

const mockVehicles: UserVehicle[] = [
  {
    id: "1",
    userId: "user-123",
    licensePlate: "ABC-1234",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    color: "Silver",
    insuranceProvider: "State Farm",
    insurancePolicyNumber: "SF-2024-ABC-1234",
    registrationExpiry: "2025-12-31",
  },
  {
    id: "2",
    userId: "user-123",
    licensePlate: "XYZ-5678",
    make: "Honda",
    model: "CR-V",
    year: 2021,
    color: "Black",
    insuranceProvider: "Allstate",
    insurancePolicyNumber: "AS-2024-XYZ-5678",
    registrationExpiry: "2024-06-30",
  },
];

interface UserVehiclesPageProps {
  vehicles?: UserVehicle[];
  onAddVehicle?: (vehicle: UserVehicle) => void;
  onDeleteVehicle?: (vehicleId: string) => void;
}

export default function UserVehiclesPage({
  vehicles = mockVehicles,
  onAddVehicle,
  onDeleteVehicle,
}: UserVehiclesPageProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
  });

  const handleAddVehicle = () => {
    const vehicle: UserVehicle = {
      id: Date.now().toString(),
      userId: "current-user",
      ...newVehicle,
    };
    onAddVehicle?.(vehicle);
    setNewVehicle({
      licensePlate: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
    });
    setShowDialog(false);
  };

  const isRegistrationExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            My Vehicles
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage your registered vehicles for quick reporting
          </p>
        </div>
        <Button
          onClick={() => setShowDialog(true)}
          className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Vehicles Grid */}
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    <Car className="h-5 w-5 text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <CardTitle className="text-slate-900 dark:text-slate-50">
                        {vehicle.make} {vehicle.model}
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        {vehicle.year}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{vehicle.color}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* License Plate */}
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    License Plate
                  </p>
                  <p className="text-lg font-mono font-bold text-slate-900 dark:text-slate-50 mt-1">
                    {vehicle.licensePlate}
                  </p>
                </div>

                {/* VIN */}
                {vehicle.vin && (
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      VIN
                    </p>
                    <p className="text-sm font-mono text-slate-700 dark:text-slate-300 mt-1">
                      {vehicle.vin}
                    </p>
                  </div>
                )}

                {/* Insurance */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Insurance
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mt-1">
                    {vehicle.insuranceProvider}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                    {vehicle.insurancePolicyNumber}
                  </p>
                </div>

                {/* Registration */}
                {vehicle.registrationExpiry && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Registration Expires
                      </p>
                      {isRegistrationExpired(vehicle.registrationExpiry) && (
                        <Badge
                          variant="outline"
                          className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        >
                          Expired
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mt-1">
                      {new Date(
                        vehicle.registrationExpiry,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    onClick={() => onDeleteVehicle?.(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6 text-center">
            <Car className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No vehicles registered yet
            </p>
            <Button
              onClick={() => setShowDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <span className="font-semibold">
              Benefits of registering vehicles:
            </span>{" "}
            Quick auto-fill during accident reporting, insurance information
            readily available, and faster claim processing.
          </p>
        </CardContent>
      </Card>

      {/* Add Vehicle Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-50">
              Add New Vehicle
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Register a vehicle for quick accident reporting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                License Plate
              </Label>
              <Input
                placeholder="ABC-1234"
                value={newVehicle.licensePlate}
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    licensePlate: e.target.value,
                  })
                }
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                  Make
                </Label>
                <Input
                  placeholder="Toyota"
                  value={newVehicle.make}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, make: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                  Model
                </Label>
                <Input
                  placeholder="Camry"
                  value={newVehicle.model}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, model: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                  Year
                </Label>
                <Input
                  type="number"
                  placeholder="2022"
                  value={newVehicle.year}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      year:
                        parseInt(e.target.value) || new Date().getFullYear(),
                    })
                  }
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                />
              </div>
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                Color
              </Label>
              <Input
                placeholder="Silver"
                value={newVehicle.color}
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, color: e.target.value })
                }
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
              />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                Insurance Provider
              </Label>
              <Input
                placeholder="State Farm"
                value={newVehicle.insuranceProvider}
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    insuranceProvider: e.target.value,
                  })
                }
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
              />
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                Policy Number
              </Label>
              <Input
                placeholder="POL-2024-ABC-1234"
                value={newVehicle.insurancePolicyNumber}
                onChange={(e) =>
                  setNewVehicle({
                    ...newVehicle,
                    insurancePolicyNumber: e.target.value,
                  })
                }
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleAddVehicle}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Add Vehicle
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
