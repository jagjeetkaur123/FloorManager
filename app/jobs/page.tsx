"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/jobs");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const filteredJobs = jobs.filter((job: any) =>
    job.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    job.jobNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <Button onClick={() => router.push("/jobs/create")}>Create Job</Button>
      </div>

      <div className="flex justify-between">
        <Input
          placeholder="Search by job number or customer..."
          className="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredJobs.map((job: any) => (
              <TableRow
                key={job.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/jobs/${job.id}`)}
              >
                <TableCell>{job.jobNumber}</TableCell>
                <TableCell>{job.customerName}</TableCell>
                <TableCell>{job.address}</TableCell>
                <TableCell>
                  <Badge variant="outline">{job.status}</Badge>
                </TableCell>
                <TableCell>
                  {job.startDate
                    ? new Date(job.startDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/jobs/${job.id}`);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filteredJobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}