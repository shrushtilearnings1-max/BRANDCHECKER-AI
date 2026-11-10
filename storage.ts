"use client";

import {
  Account,
  ActivityLog,
  AnalysisReport,
  BrandDnaDriftReport,
  ClaimTraceReport,
  ClaimVerificationStatus,
  ContentIssue,
  ContentItem,
    NotificationItem,
  PersonaResonanceReport,
  ReviewComment,
  ScoringWeights,
  User,
  UserRole,
} from "@/types";
import {
  INITIAL_ACCOUNTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_CONTENT_ITEMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEW_COMMENTS,
  INITIAL_USERS,
} from "./initialData";
import { analyzeContentWithBrandRules } from "./analysis-engine";
import { extractAndVerifyClaims } from "./claim-trace";
import { calculateBrandDnaDrift } from "./drift-detector";
import { simulatePersonaResonance } from "./persona-resonance";

const STORAGE_KEYS = {
  ACCOUNTS: "brandchecker_accounts_v1",
  ACTIVE_ACCOUNT_ID: "brandchecker_active_account_id_v1",
  CURRENT_USER: "brandchecker_current_user_v1",
  CONTENT_ITEMS: "brandchecker_content_items_v1",
  REPORTS: "brandchecker_reports_v1",
  COMMENTS: "brandchecker_comments_v1",
  NOTIFICATIONS: "brandchecker_notifications_v1",
  ACTIVITY_LOGS: "brandchecker_activity_logs_v1",
  GEMINI_API_KEY: "brandchecker_gemini_key_v1",
  CLAIM_TRACE: "brandchecker_claim_trace_v1",
  BRAND_DRIFT: "brandchecker_brand_drift_v1",
  PERSONA_RESONANCE: "brandchecker_persona_resonance_v1",
};

export class StorageService {
  private static isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  // --- ACCOUNTS ---
  static getAccounts(): Account[] {
    if (!this.isBrowser()) return INITIAL_ACCOUNTS;
    const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ACCOUNTS;
    }
  }

  static getAccountById(id: string): Account | undefined {
    return this.getAccounts().find(a => a.id === id);
  }

  static saveAccount(account: Account): void {
    if (!this.isBrowser()) return;
    const accounts = this.getAccounts();
    const index = accounts.findIndex(a => a.id === account.id);
    if (index >= 0) {
      accounts[index] = { ...account, updatedAt: new Date().toISOString() };
    } else {
      accounts.push({
        ...account,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }

  static getActiveAccountId(): string {
    if (!this.isBrowser()) return INITIAL_ACCOUNTS[0].id;
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_ACCOUNT_ID);
    if (stored && this.getAccountById(stored)) {
      return stored;
    }
    const defaultId = INITIAL_ACCOUNTS[0].id;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ACCOUNT_ID, defaultId);
    return defaultId;
  }

  static setActiveAccountId(id: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ACCOUNT_ID, id);
  }

  // --- CURRENT USER & AUTH ---
  static getUsers(): User[] {
    return INITIAL_USERS;
  }

  static getCurrentUser(): User {
    if (!this.isBrowser()) return INITIAL_USERS[0];
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    return INITIAL_USERS[0];
  }

  static setCurrentUserRole(role: UserRole): User {
    const user = INITIAL_USERS.find(u => u.role === role) || {
      ...this.getCurrentUser(),
      role,
    };
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    return user;
  }

  // --- CONTENT ITEMS ---
  static getContentItems(accountId?: string): ContentItem[] {
    if (!this.isBrowser()) return INITIAL_CONTENT_ITEMS;
    const stored = localStorage.getItem(STORAGE_KEYS.CONTENT_ITEMS);
    let items: ContentItem[] = INITIAL_CONTENT_ITEMS;
    if (stored) {
      try {
        items = JSON.parse(stored);
      } catch {
        items = INITIAL_CONTENT_ITEMS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.CONTENT_ITEMS, JSON.stringify(INITIAL_CONTENT_ITEMS));
    }
    return accountId ? items.filter(item => item.accountId === accountId) : items;
  }

  static getContentItemById(id: string): ContentItem | undefined {
    return this.getContentItems().find(c => c.id === id);
  }

  static saveContentItem(item: ContentItem): void {
    if (!this.isBrowser()) return;
    const items = this.getContentItems();
    const index = items.findIndex(c => c.id === item.id);
    if (index >= 0) {
      items[index] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      items.unshift(item);
    }
    localStorage.setItem(STORAGE_KEYS.CONTENT_ITEMS, JSON.stringify(items));
  }

  // --- ANALYSIS REPORTS ---
  static getReports(): AnalysisReport[] {
    if (!this.isBrowser()) return [];
    const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static getReportById(id: string): AnalysisReport | undefined {
    return this.getReports().find(r => r.id === id);
  }

  static saveReport(report: AnalysisReport): void {
    if (!this.isBrowser()) return;
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === report.id);
    if (index >= 0) {
      reports[index] = report;
    } else {
      reports.unshift(report);
    }
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }

  // --- REVIEW COMMENTS ---
  static getComments(contentId: string): ReviewComment[] {
    if (!this.isBrowser()) return INITIAL_REVIEW_COMMENTS[contentId] || [];
    const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    let map: Record<string, ReviewComment[]> = INITIAL_REVIEW_COMMENTS;
    if (stored) {
      try {
        map = JSON.parse(stored);
      } catch {}
    } else {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_REVIEW_COMMENTS));
    }
    return map[contentId] || [];
  }

  static addComment(comment: ReviewComment): void {
    if (!this.isBrowser()) return;
    const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    let map: Record<string, ReviewComment[]> = INITIAL_REVIEW_COMMENTS;
    if (stored) {
      try {
        map = JSON.parse(stored);
      } catch {}
    }
    if (!map[comment.contentId]) {
      map[comment.contentId] = [];
    }
    map[comment.contentId].push(comment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(map));
  }

  // --- NOTIFICATIONS ---
  static getNotifications(): NotificationItem[] {
    if (!this.isBrowser()) return INITIAL_NOTIFICATIONS;
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  static addNotification(item: Omit<NotificationItem, "id" | "createdAt" | "read">): void {
    if (!this.isBrowser()) return;
    const list = this.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  static markNotificationAsRead(id: string): void {
    if (!this.isBrowser()) return;
    const list = this.getNotifications();
    const notif = list.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    }
  }

  static markAllNotificationsAsRead(): void {
    if (!this.isBrowser()) return;
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  // --- ACTIVITY LOGS ---
  static getActivityLogs(accountId?: string): ActivityLog[] {
    if (!this.isBrowser()) return INITIAL_ACTIVITY_LOGS;
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    let logs: ActivityLog[] = INITIAL_ACTIVITY_LOGS;
    if (stored) {
      try {
        logs = JSON.parse(stored);
      } catch {}
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
    }
    return accountId ? logs.filter(l => l.accountId === accountId) : logs;
  }

  static logActivity(log: Omit<ActivityLog, "id" | "timestamp">): void {
    if (!this.isBrowser()) return;
    const logs = this.getActivityLogs();
    logs.unshift({
      ...log,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 50)));
  }

  // --- GEMINI API KEY ---
  static getGeminiApiKey(): string {
    if (!this.isBrowser()) return "";
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || "";
  }

  static setGeminiApiKey(key: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key);
  }

  // --- CLAIMTRACE REPORTS ---
  static getClaimTraceReport(contentId: string): ClaimTraceReport | undefined {
    if (!this.isBrowser()) return undefined;
    const stored = localStorage.getItem(STORAGE_KEYS.CLAIM_TRACE);
    if (!stored) return undefined;
    try {
      const map: Record<string, ClaimTraceReport> = JSON.parse(stored);
      return map[contentId];
    } catch {
      return undefined;
    }
  }

  static saveClaimTraceReport(report: ClaimTraceReport): void {
    if (!this.isBrowser()) return;
    const stored = localStorage.getItem(STORAGE_KEYS.CLAIM_TRACE);
    let map: Record<string, ClaimTraceReport> = {};
    if (stored) {
      try {
        map = JSON.parse(stored);
      } catch {}
    }
    map[report.contentId] = report;
    localStorage.setItem(STORAGE_KEYS.CLAIM_TRACE, JSON.stringify(map));
  }

  static updateClaimStatus(
    contentId: string,
    claimId: string,
    status: ClaimVerificationStatus,
    reviewerNote?: string
  ): void {
    const report = this.getClaimTraceReport(contentId);
    if (!report) return;
    const targetClaim = report.claims.find(c => c.id === claimId);
    if (targetClaim) {
      targetClaim.status = status;
      targetClaim.isReviewed = true;
      if (reviewerNote) {
        targetClaim.reviewerNote = reviewerNote;
      }
      this.saveClaimTraceReport(report);
    }
  }

  // --- BRAND DNA DRIFT REPORTS ---
  static getDriftReport(accountId: string): BrandDnaDriftReport {
    const account = this.getAccountById(accountId) || this.getAccounts()[0];
    const items = this.getContentItems(accountId);

    if (this.isBrowser()) {
      const stored = localStorage.getItem(STORAGE_KEYS.BRAND_DRIFT);
      if (stored) {
        try {
          const map: Record<string, BrandDnaDriftReport> = JSON.parse(stored);
          if (map[accountId]) {
            return map[accountId];
          }
        } catch {}
      }
    }

    // Compute fresh report from account and items
    const fresh = calculateBrandDnaDrift(account, items);
    this.saveDriftReport(fresh);
    return fresh;
  }

  static saveDriftReport(report: BrandDnaDriftReport): void {
    if (!this.isBrowser()) return;
    const stored = localStorage.getItem(STORAGE_KEYS.BRAND_DRIFT);
    let map: Record<string, BrandDnaDriftReport> = {};
    if (stored) {
      try {
        map = JSON.parse(stored);
      } catch {}
    }
    map[report.accountId] = report;
    localStorage.setItem(STORAGE_KEYS.BRAND_DRIFT, JSON.stringify(map));
  }

  // --- FEATURE THREE: AUDIENCE PERSONA RESONANCE ---
  static getPersonaResonanceReport(contentId: string): PersonaResonanceReport | null {
    if (!this.isBrowser()) return null;
    const stored = localStorage.getItem(STORAGE_KEYS.PERSONA_RESONANCE);
    if (!stored) return null;
    try {
      const map: Record<string, PersonaResonanceReport> = JSON.parse(stored);
      return map[contentId] || null;
    } catch {
      return null;
    }
  }

  static savePersonaResonanceReport(report: PersonaResonanceReport): void {
    if (!this.isBrowser()) return;
    const stored = localStorage.getItem(STORAGE_KEYS.PERSONA_RESONANCE);
    let map: Record<string, PersonaResonanceReport> = {};
    if (stored) {
      try {
        map = JSON.parse(stored);
      } catch {}
    }
    map[report.contentId] = report;
    localStorage.setItem(STORAGE_KEYS.PERSONA_RESONANCE, JSON.stringify(map));
  }

  /**
   * Generates initial analysis reports if not already stored.
   */
  static async initializeSampleReports(): Promise<void> {
    if (!this.isBrowser()) return;
    const reports = this.getReports();
    if (reports.length > 0) return;

    const accounts = this.getAccounts();
    const items = this.getContentItems();

    for (const item of items) {
      const acc = accounts.find(a => a.id === item.accountId) || accounts[0];
      const report = await analyzeContentWithBrandRules({
        content: item.rawContent,
        title: item.title,
        account: acc,
        category: item.category,
        targetPlatform: item.targetPlatform,
        intendedAudience: item.intendedAudience,
      });

      // Run ClaimTrace verification on each initial item
      const claimTraceReport = extractAndVerifyClaims({
        content: item.rawContent,
        title: item.title,
        account: acc,
        contentId: item.id,
      });

      this.saveClaimTraceReport(claimTraceReport);
      report.claimTrace = claimTraceReport;

      // Run Audience Persona Resonance simulation
      const personaReport = simulatePersonaResonance({
        content: item.rawContent,
        targetAudience: item.intendedAudience,
        account: acc,
        contentId: item.id,
      });

      this.savePersonaResonanceReport(personaReport);
      report.personaResonance = personaReport;

      report.id = item.latestReportId || `rep-${item.id}`;
      report.contentId = item.id;
      report.contentVersion = item.currentVersion;
      this.saveReport(report);
    }

    // Initialize drift reports for all accounts
    for (const acc of accounts) {
      const drift = calculateBrandDnaDrift(acc, items);
      this.saveDriftReport(drift);
    }
  }
}
