import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { IncidentReport } from "@/types/incident";

const STORAGE_KEY = "swift-response-hub/accidents/v2";

type IncidentUpdater =
  | Partial<IncidentReport>
  | ((incident: IncidentReport) => Partial<IncidentReport>);

interface IncidentStoreValue {
  incidents: IncidentReport[];
  addIncident: (incident: IncidentReport) => void;
  updateIncident: (reportId: string, updates: IncidentUpdater) => void;
  hydrateIncidents: (remoteIncidents: IncidentReport[]) => void;
  resetIncidents: () => void;
}

const IncidentStoreContext = createContext<IncidentStoreValue | null>(null);

function sortIncidents(incidents: IncidentReport[]) {
  return [...incidents].sort((left, right) => {
    const leftTime = new Date(
      left.created_at || left.time_report_submitted,
    ).getTime();
    const rightTime = new Date(
      right.created_at || right.time_report_submitted,
    ).getTime();
    return rightTime - leftTime;
  });
}

function getIncidentKey(incident: IncidentReport) {
  return incident.backend_accident_id || incident.report_id;
}

function mergeIncidentCollections(
  current: IncidentReport[],
  remote: IncidentReport[],
) {
  const currentByKey = new Map(
    current.map((incident) => [getIncidentKey(incident), incident]),
  );
  const remoteByKey = new Map(
    remote.map((incident) => [getIncidentKey(incident), incident]),
  );
  const merged = remote.map((incident) => {
    const existing = currentByKey.get(getIncidentKey(incident));

    if (!existing) {
      return incident;
    }

    return {
      ...incident,
      ...existing,
      report_id: incident.report_id,
      backend_accident_id:
        incident.backend_accident_id ?? existing.backend_accident_id,
      backend_report_number:
        incident.backend_report_number ?? existing.backend_report_number,
      created_at: incident.created_at,
      updated_at: existing.updated_at || incident.updated_at,
      time_report_submitted: incident.time_report_submitted,
      time_of_incident: incident.time_of_incident,
      location_address: incident.location_address,
      gps_latitude: incident.gps_latitude,
      gps_longitude: incident.gps_longitude,
      short_description:
        existing.short_description || incident.short_description,
      severity_level: existing.severity_level || incident.severity_level,
    };
  });

  const leftovers = current.filter(
    (incident) => !remoteByKey.has(getIncidentKey(incident)),
  );

  return sortIncidents([...merged, ...leftovers]);
}

function readStoredIncidents() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortIncidents(parsed as IncidentReport[]);
  } catch {
    return [];
  }
}

export function IncidentStoreProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] =
    useState<IncidentReport[]>(readStoredIncidents);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  }, [incidents]);

  const addIncident = useCallback((incident: IncidentReport) => {
    setIncidents((current) =>
      sortIncidents([
        incident,
        ...current.filter((item) => item.report_id !== incident.report_id),
      ]),
    );
  }, []);

  const updateIncident = useCallback(
    (reportId: string, updates: IncidentUpdater) => {
      setIncidents((current) =>
        sortIncidents(
          current.map((incident) => {
            if (incident.report_id !== reportId) {
              return incident;
            }

            const nextUpdates =
              typeof updates === "function" ? updates(incident) : updates;

            return {
              ...incident,
              ...nextUpdates,
              updated_at: new Date().toISOString(),
            };
          }),
        ),
      );
    },
    [],
  );

  const hydrateIncidents = useCallback((remoteIncidents: IncidentReport[]) => {
    setIncidents((current) =>
      mergeIncidentCollections(current, remoteIncidents),
    );
  }, []);

  const resetIncidents = useCallback(() => {
    setIncidents([]);
  }, []);

  const value = useMemo(
    () => ({
      incidents,
      addIncident,
      updateIncident,
      hydrateIncidents,
      resetIncidents,
    }),
    [addIncident, hydrateIncidents, incidents, resetIncidents, updateIncident],
  );

  return (
    <IncidentStoreContext.Provider value={value}>
      {children}
    </IncidentStoreContext.Provider>
  );
}

export function useIncidentStore() {
  const value = useContext(IncidentStoreContext);

  if (!value) {
    throw new Error(
      "useIncidentStore must be used within an IncidentStoreProvider",
    );
  }

  return value;
}
