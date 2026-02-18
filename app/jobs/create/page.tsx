"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "@/lib/axios";

const emptyContact = { name: "", address1: "", address2: "", phone: "", email: "" };

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [contacts, setContacts] = useState([{ ...emptyContact }, { ...emptyContact }]);

  const updateContact = (index: number, field: string, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const jobData = {
        title: title || contacts[0].name,
        description: contacts
          .filter((c) => c.name)
          .map((c, i) => `Contact ${i + 1}: ${c.name} | ${c.phone} | ${c.email} | ${c.address1} ${c.address2}`)
          .join("\n"),
        status,
      };
      const response = await axios.post("/jobs", jobData);
      router.push(`/jobs/${response.data.id}`);
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactLabels = ["Primary Contact", "Secondary Contact"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Create New Job</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.back()}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? "Creating..." : "Create Job"}
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">

        {/* Job Info */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-3 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Job Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Roof Repair - Smith Residence"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts */}
        {contacts.map((contact, index) => (
          <Card key={index} className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 pt-4 px-5">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? "bg-blue-500" : "bg-slate-400"}`}>
                  {index + 1}
                </span>
                {contactLabels[index]}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Full Name</Label>
                <Input
                  value={contact.name}
                  onChange={(e) => updateContact(index, "name", e.target.value)}
                  placeholder="Full name"
                  className="h-9 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Phone</Label>
                  <Input
                    value={contact.phone}
                    onChange={(e) => updateContact(index, "phone", e.target.value)}
                    placeholder="Phone number"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Email</Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateContact(index, "email", e.target.value)}
                    placeholder="Email address"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Address Line 1</Label>
                <Input
                  value={contact.address1}
                  onChange={(e) => updateContact(index, "address1", e.target.value)}
                  placeholder="Street address"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Address Line 2</Label>
                <Input
                  value={contact.address2}
                  onChange={(e) => updateContact(index, "address2", e.target.value)}
                  placeholder="Suburb, State, Postcode"
                  className="h-9 text-sm"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            {loading ? "Creating..." : "Create Job"}
          </Button>
        </div>

      </div>
    </div>
  );
}
