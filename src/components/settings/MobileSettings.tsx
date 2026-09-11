"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import {
  Check,
  Copy,
  ExternalLink,
  Info,
  Loader2,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { toastError, toastSuccess } from "@/lib/toast";

interface PairingData {
  version: number;
  appName: string;
  serverUrl: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function MobileSettings() {
  const [loading, setLoading] = useState(true);
  const [pairingData, setPairingData] = useState<PairingData | null>(null);
  const [customServerUrl, setCustomServerUrl] = useState("");
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const fetchPairing = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/pair");
      if (!res.ok) {
        throw new Error("Failed to load mobile pairing credentials");
      }
      const json = await res.json();
      if (json.success && json.pairing) {
        setPairingData(json.pairing);
        setCustomServerUrl(json.pairing.serverUrl);
      }
    } catch (err: any) {
      toastError(err?.message || "Failed to load mobile pairing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPairing();
  }, []);

  const activeQrPayload = pairingData
    ? JSON.stringify({
        ...pairingData,
        serverUrl: customServerUrl.trim() || pairingData.serverUrl,
      })
    : "";

  const copyToClipboard = async (text: string, type: "token" | "url") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "token") {
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
      } else {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
      toastSuccess("Copied to clipboard");
    } catch {
      toastError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Connect Mobile App
              </CardTitle>
              <CardDescription>
                Link your iOS or Android device directly to this NudgePath instance with zero hassle.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPairing}
              disabled={loading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="grid gap-8 lg:grid-cols-[260px_1fr] items-start">
              {/* QR Code Skeleton */}
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-[252px] w-[252px] rounded-xl border border-border" />
                <Skeleton className="h-3 w-32" />
              </div>

              {/* Form Input Skeletons */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md shrink-0" />
                  </div>
                  <Skeleton className="h-3 w-3/4" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md shrink-0" />
                  </div>
                </div>

                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
          ) : pairingData ? (
            <div className="grid gap-8 lg:grid-cols-[260px_1fr] items-start">
              {/* QR Code Box */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-border">
                  <QRCodeSVG
                    value={activeQrPayload}
                    size={220}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <span className="text-xs text-muted-foreground text-center">
                  Scan in NudgePath Mobile
                </span>
              </div>

              {/* Pairing Config & Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="server-url" className="text-sm font-medium">
                    Server Address
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="server-url"
                      value={customServerUrl}
                      onChange={(e) => setCustomServerUrl(e.target.value)}
                      placeholder="http://192.168.1.50:3737 or https://your-domain.com"
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(customServerUrl, "url")}
                      title="Copy Server URL"
                    >
                      {copiedUrl ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Auto-detected from your browser connection. If testing locally on your phone, ensure this uses your LAN IP (e.g. <code>http://192.168.x.x:3737</code>) instead of localhost.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Pairing Token (60-day validity)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      readOnly
                      value={pairingData.token}
                      className="font-mono text-xs text-muted-foreground bg-muted/40 select-all"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(pairingData.token, "token")}
                      title="Copy Token"
                    >
                      {copiedToken ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/30 p-4 border border-border/40 text-xs space-y-3">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Three Easy Steps to Pair:
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">1</span>
                      <span className="pt-0.5">Open the <strong>NudgePath Mobile</strong> app on your device.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">2</span>
                      <span className="pt-0.5">Tap <strong>Scan Pairing QR Code</strong> on the login screen.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">3</span>
                      <span className="pt-0.5">Aim your camera at the QR code above to instantly connect!</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border/30 text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    100% Private &amp; Direct: No middleman or third-party servers.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-destructive">
              Unable to generate pairing data. Please ensure you are logged in.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
