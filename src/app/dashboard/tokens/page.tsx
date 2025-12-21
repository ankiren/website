"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Key, Trash2, Copy, Check, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface Token {
  id: string;
  name: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create token modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [newTokenExpiry, setNewTokenExpiry] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // New token display state
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch tokens
  const fetchTokens = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/me/tokens");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch tokens");
      }
      const data = await response.json();
      setTokens(data.tokens || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tokens");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // Create token
  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);

    try {
      const response = await fetch("/api/me/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTokenName.trim(),
          expiresAt: newTokenExpiry || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create token");
      }

      const data = await response.json();
      setNewToken(data.token);
      setNewTokenName("");
      setNewTokenExpiry("");
      await fetchTokens();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create token");
    } finally {
      setIsCreating(false);
    }
  };

  // Delete token
  const handleDeleteToken = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this token? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/me/tokens/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete token");
      }

      await fetchTokens();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete token");
    } finally {
      setDeletingId(null);
    }
  };

  // Copy token to clipboard
  const handleCopyToken = async () => {
    if (!newToken) return;
    try {
      await navigator.clipboard.writeText(newToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy token");
    }
  };

  // Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if token is expired
  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  // Close create modal and reset state
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewTokenName("");
    setNewTokenExpiry("");
    setCreateError(null);
    setNewToken(null);
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Decorative Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200/40 to-cyan-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">API Tokens</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your personal access tokens for API authentication
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl shadow-gray-200/50 overflow-hidden">
            {/* Header with gradient */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
              <div className="relative p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-white">
                    <h2 className="text-3xl font-black">Personal Access Tokens</h2>
                    <p className="text-white/70 mt-1 font-medium">
                      Tokens allow API access without a browser session
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl font-bold text-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                    Generate Token
                  </button>
                </div>
              </div>
            </div>

            {/* Token List */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 text-red-500">
                  <AlertCircle className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium">{error}</p>
                  <button
                    onClick={fetchTokens}
                    className="mt-4 text-sm text-indigo-600 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : tokens.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <Key className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No tokens yet</p>
                  <p className="text-sm mt-1">
                    Generate a token to access the API programmatically
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tokens.map((token) => (
                    <div
                      key={token.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                        isExpired(token.expiresAt)
                          ? "bg-red-50/50 border-red-200"
                          : "bg-gray-50 border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          isExpired(token.expiresAt)
                            ? "bg-red-100 text-red-600"
                            : "bg-indigo-100 text-indigo-600"
                        }`}>
                          <Key className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {token.name}
                            </h3>
                            {isExpired(token.expiresAt) && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                Expired
                              </span>
                            )}
                          </div>
                          <div className="flex gap-4 mt-1 text-sm text-gray-500">
                            <span>Created: {formatDate(token.createdAt)}</span>
                            <span>Last used: {formatDate(token.lastUsedAt)}</span>
                            {token.expiresAt && (
                              <span>
                                Expires: {formatDate(token.expiresAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteToken(token.id)}
                        disabled={deletingId === token.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Revoke token"
                      >
                        {deletingId === token.id ? (
                          <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!isLoading && !error && tokens.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {tokens.length} token{tokens.length !== 1 && "s"}
                </p>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Security Notice</p>
                <p className="mt-1">
                  Tokens grant full API access with your permissions. Keep them
                  secure and never share them. Revoke tokens immediately if
                  compromised.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Token Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        title={newToken ? "Token Created" : "Generate New Token"}
        size="md"
      >
        {newToken ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">
                    Token generated successfully!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Copy this token now. You won&apos;t be able to see it again.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                readOnly
                value={newToken}
                className="w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-200 rounded-xl font-mono text-sm"
              />
              <button
                onClick={handleCopyToken}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy token"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={closeCreateModal}>Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateToken} className="space-y-4">
            {createError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {createError}
              </div>
            )}

            <div>
              <label
                htmlFor="token-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Token Name
              </label>
              <input
                id="token-name"
                type="text"
                required
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                placeholder="e.g., E2E Testing, CI/CD Pipeline"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                A descriptive name to identify this token
              </p>
            </div>

            <div>
              <label
                htmlFor="token-expiry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expiration Date (Optional)
              </label>
              <input
                id="token-expiry"
                type="datetime-local"
                value={newTokenExpiry}
                onChange={(e) => setNewTokenExpiry(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for a token that never expires
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={closeCreateModal}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || !newTokenName.trim()}>
                {isCreating ? "Generating..." : "Generate Token"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
