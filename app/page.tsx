"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "@/lib/axios";

export default function CreateJobPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Job Information
    leadNumber: "",
    jobCategory: "",
    shop: "Hallam",
    jobSource: "",
    terms: "",
    
    // Client/Site Information
    copyFrom: "new", // new, current_job, client, project, template
    customerName: "",
    siteStreet: "",
    siteTown: "",
    siteState: "VIC",
    siteCountry: "Australia",
    siteZip: "",
    projectName: "",
    
    // Billing Information
    billingSameAsSite: true,
    billingStreet: "",
    billingTown: "",
    billingState: "VIC",
    billingCountry: "Australia",
    billingZip: "",
    
    // Contact Information
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactFax: "",
    jobRef: "",
    
    // Costing & Dates
    quoteDate: new Date().toISOString().split('T')[0],
    initiatedDate: new Date().toISOString().split('T')[0],
    completedDate: "",
    completedPercentage: 0,
    costPrice: 0,
    sellPrice: 0,
    
    // Sales Reps
    salesReps: [{ name: "", split: 100 }],
    
    // Job Details
    title: "",
    description: "",
    status: "pending",
    startDate: "",
    endDate: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSalesRep = () => {
    setFormData(prev => ({
      ...prev,
      salesReps: [...prev.salesReps, { name: "", split: 0 }]
    }));
  };

  const updateSalesRep = (index: number, field: string, value: any) => {
    const newReps = [...formData.salesReps];
    newReps[index] = { ...newReps[index], [field]: value };
    setFormData(prev => ({ ...prev, salesReps: newReps }));
  };

  const removeSalesRep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      salesReps: prev.salesReps.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare data for backend
      const jobData = {
        title: formData.title || `${formData.customerName} - ${formData.projectName}`,
        description: formData.description,
        status: formData.status,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        costPrice: parseFloat(formData.costPrice.toString()) || 0,
        sellPrice: parseFloat(formData.sellPrice.toString()) || 0,
      };

      const response = await axios.post("/jobs", jobData);
      
      // Redirect to job detail page
      router.push(`/jobs/${response.data.id}`);
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalSplit = formData.salesReps.reduce((sum, rep) => sum + (parseFloat(rep.split.toString()) || 0), 0);

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Job</h1>
          <p className="text-muted-foreground">Fill in the details to create a new job</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Lead Number Display */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lead Number</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formData.leadNumber || "45466"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Shop Location</p>
              <p className="text-xl font-semibold">{formData.shop}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div
                className={`w-24 h-1 ${
                  currentStep > step ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Job Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
              <CardDescription>Basic job details and classification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leadNumber">Lead Number</Label>
                  <Input
                    id="leadNumber"
                    value={formData.leadNumber}
                    onChange={(e) => updateField("leadNumber", e.target.value)}
                    placeholder="45466"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobCategory">Job Category *</Label>
                  <Select value={formData.jobCategory} onValueChange={(val) => updateField("jobCategory", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shop">Shop Location</Label>
                  <Select value={formData.shop} onValueChange={(val) => updateField("shop", val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hallam">Hallam</SelectItem>
                      <SelectItem value="Melbourne">Melbourne</SelectItem>
                      <SelectItem value="Sydney">Sydney</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobSource">Job Source</Label>
                  <Input
                    id="jobSource"
                    value={formData.jobSource}
                    onChange={(e) => updateField("jobSource", e.target.value)}
                    placeholder="Referral, Website, etc."
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="terms">Terms</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => updateField("terms", e.target.value)}
                    placeholder="Payment terms and conditions"
                    rows={3}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Brief job title"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Detailed job description"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setCurrentStep(2)}>
              Next: Client Details
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Client/Site Information */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Copy From Source</CardTitle>
              <CardDescription>Select a source to copy particulars from</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={formData.copyFrom} onValueChange={(val) => updateField("copyFrom", val)}>
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="current_job">Current Job</TabsTrigger>
                  <TabsTrigger value="client">Client</TabsTrigger>
                  <TabsTrigger value="project">Project</TabsTrigger>
                  <TabsTrigger value="template">Template</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Job site address and project details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name (Person) *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => updateField("customerName", e.target.value)}
                  placeholder="Customer full name"
                  className="border-red-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteStreet">Street Address</Label>
                <Input
                  id="siteStreet"
                  value={formData.siteStreet}
                  onChange={(e) => updateField("siteStreet", e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTown">Town</Label>
                  <Input
                    id="siteTown"
                    value={formData.siteTown}
                    onChange={(e) => updateField("siteTown", e.target.value)}
                    placeholder="Town/Suburb"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteState">State</Label>
                  <Select value={formData.siteState} onValueChange={(val) => updateField("siteState", val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIC">VIC</SelectItem>
                      <SelectItem value="NSW">NSW</SelectItem>
                      <SelectItem value="QLD">QLD</SelectItem>
                      <SelectItem value="SA">SA</SelectItem>
                      <SelectItem value="WA">WA</SelectItem>
                      <SelectItem value="TAS">TAS</SelectItem>
                      <SelectItem value="NT">NT</SelectItem>
                      <SelectItem value="ACT">ACT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteCountry">Country</Label>
                  <Input
                    id="siteCountry"
                    value={formData.siteCountry}
                    onChange={(e) => updateField("siteCountry", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteZip">Zip/Postcode</Label>
                  <Input
                    id="siteZip"
                    value={formData.siteZip}
                    onChange={(e) => updateField("siteZip", e.target.value)}
                    placeholder="Postcode"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => updateField("projectName", e.target.value)}
                  placeholder="Project name or reference"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
              <CardDescription>Billing information (if different from site)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="billingSame"
                  checked={formData.billingSameAsSite}
                  onChange={(e) => updateField("billingSameAsSite", e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="billingSame">Same as site address</Label>
              </div>

              {!formData.billingSameAsSite && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="billingStreet">Street Address</Label>
                    <Input
                      id="billingStreet"
                      value={formData.billingStreet}
                      onChange={(e) => updateField("billingStreet", e.target.value)}
                      placeholder="Billing street address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingTown">Town</Label>
                      <Input
                        id="billingTown"
                        value={formData.billingTown}
                        onChange={(e) => updateField("billingTown", e.target.value)}
                        placeholder="Town/Suburb"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingState">State</Label>
                      <Select value={formData.billingState} onValueChange={(val) => updateField("billingState", val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VIC">VIC</SelectItem>
                          <SelectItem value="NSW">NSW</SelectItem>
                          <SelectItem value="QLD">QLD</SelectItem>
                          <SelectItem value="SA">SA</SelectItem>
                          <SelectItem value="WA">WA</SelectItem>
                          <SelectItem value="TAS">TAS</SelectItem>
                          <SelectItem value="NT">NT</SelectItem>
                          <SelectItem value="ACT">ACT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingCountry">Country</Label>
                      <Input
                        id="billingCountry"
                        value={formData.billingCountry}
                        onChange={(e) => updateField("billingCountry", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billingZip">Zip/Postcode</Label>
                      <Input
                        id="billingZip"
                        value={formData.billingZip}
                        onChange={(e) => updateField("billingZip", e.target.value)}
                        placeholder="Postcode"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => updateField("contactPhone", e.target.value)}
                    placeholder="Contact phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => updateField("contactName", e.target.value)}
                    placeholder="Contact person name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateField("contactEmail", e.target.value)}
                    placeholder="Email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactFax">Fax</Label>
                  <Input
                    id="contactFax"
                    value={formData.contactFax}
                    onChange={(e) => updateField("contactFax", e.target.value)}
                    placeholder="Fax number"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="jobRef">Job Reference</Label>
                  <Input
                    id="jobRef"
                    value={formData.jobRef}
                    onChange={(e) => updateField("jobRef", e.target.value)}
                    placeholder="Internal job reference"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Previous
            </Button>
            <Button onClick={() => setCurrentStep(3)}>
              Next: Costing & Quote
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Costing & Quote */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quoteDate">Quote Date</Label>
                  <Input
                    id="quoteDate"
                    type="date"
                    value={formData.quoteDate}
                    onChange={(e) => updateField("quoteDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initiatedDate">Initiated Date</Label>
                  <Input
                    id="initiatedDate"
                    type="date"
                    value={formData.initiatedDate}
                    onChange={(e) => updateField("initiatedDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="completedDate">Completed Date</Label>
                  <Input
                    id="completedDate"
                    type="date"
                    value={formData.completedDate}
                    onChange={(e) => updateField("completedDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="completedPercentage">Completed %</Label>
                  <Input
                    id="completedPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.completedPercentage}
                    onChange={(e) => updateField("completedPercentage", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price ($)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => updateField("costPrice", e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellPrice">Sell Price ($)</Label>
                  <Input
                    id="sellPrice"
                    type="number"
                    step="0.01"
                    value={formData.sellPrice}
                    onChange={(e) => updateField("sellPrice", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {formData.costPrice > 0 && formData.sellPrice > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${(parseFloat(formData.sellPrice.toString()) - parseFloat(formData.costPrice.toString())).toFixed(2)}
                    {" "}
                    ({(((parseFloat(formData.sellPrice.toString()) - parseFloat(formData.costPrice.toString())) / parseFloat(formData.sellPrice.toString())) * 100).toFixed(1)}%)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Representatives</CardTitle>
              <CardDescription>
                Assign sales reps and split percentages (Total: {totalSplit.toFixed(0)}%)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.salesReps.map((rep, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Sales Rep Name</Label>
                    <Input
                      value={rep.name}
                      onChange={(e) => updateSalesRep(index, "name", e.target.value)}
                      placeholder="Rep name"
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Split %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={rep.split}
                      onChange={(e) => updateSalesRep(index, "split", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  {formData.salesReps.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSalesRep(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addSalesRep} className="w-full">
                + Add Sales Rep
              </Button>

              {totalSplit !== 100 && formData.salesReps.some(r => r.name) && (
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  ⚠️ Total split should equal 100% (currently {totalSplit.toFixed(0)}%)
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(val) => updateField("status", val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Previous
            </Button>
            <Button onClick={() => setCurrentStep(4)}>
              Next: Review
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Job Details</CardTitle>
              <CardDescription>Please review all information before creating the job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Information Summary */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Job Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Lead Number</p>
                    <p className="font-medium">{formData.leadNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Job Category</p>
                    <p className="font-medium">{formData.jobCategory || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Shop</p>
                    <p className="font-medium">{formData.shop}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Job Source</p>
                    <p className="font-medium">{formData.jobSource || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Title</p>
                    <p className="font-medium">{formData.title || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Description</p>
                    <p className="font-medium">{formData.description || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Client Information Summary */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Client & Site Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer Name</p>
                    <p className="font-medium">{formData.customerName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Project</p>
                    <p className="font-medium">{formData.projectName || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Site Address</p>
                    <p className="font-medium">
                      {formData.siteStreet && `${formData.siteStreet}, `}
                      {formData.siteTown && `${formData.siteTown}, `}
                      {formData.siteState} {formData.siteZip}
                      {formData.siteCountry && `, ${formData.siteCountry}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact Phone</p>
                    <p className="font-medium">{formData.contactPhone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact Email</p>
                    <p className="font-medium">{formData.contactEmail || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Costing Summary */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">Costing & Dates</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Cost Price</p>
                    <p className="font-medium">${formData.costPrice || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sell Price</p>
                    <p className="font-medium">${formData.sellPrice || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quote Date</p>
                    <p className="font-medium">{formData.quoteDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{formData.startDate || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{formData.status.replace("_", " ")}</p>
                  </div>
                </div>
              </div>

              {/* Sales Reps Summary */}
              {formData.salesReps.some(r => r.name) && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg border-b pb-2">Sales Representatives</h3>
                  <div className="space-y-2 text-sm">
                    {formData.salesReps.filter(r => r.name).map((rep, idx) => (
                      <div key={idx} className="flex justify-between">
                        <p className="font-medium">{rep.name}</p>
                        <p className="text-muted-foreground">{rep.split}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              Previous
            </Button>
            <Button onClick={handleSubmit} disabled={loading} size="lg">
              {loading ? "Creating Job..." : "Create Job"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
