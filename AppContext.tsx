"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Account,
  ActivityLog,
  AnalysisReport,
  ContentItem,
  NotificationItem,
  ScoringWeights,
  User,
  UserRole,
} from "@/types";
import { StorageService } from "@/lib/storage";

interface AppContextType {
  accounts: Account[];
  activeAccount: Account;
  setActiveAccount: (accountOrId: Account | string) => void;
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  contentItems: ContentItem[];
  activeAccountContentItems: ContentItem[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  activityLogs: ActivityLog[];
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  refreshData: () => void;
  updateAccount: (account: Account) => void;
  updateAccountScoringWeights: (weights: ScoringWeights) => void;
  updateContentItem: (item: ContentItem) => void;
  logActivity: (action: string, details: string) => void;
  isReady: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User>(StorageService.getCurrentUser());
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

  const loadAll = async () => {
    await StorageService.initializeSampleReports();
    const accs = StorageService.getAccounts();
    const activeId = StorageService.getActiveAccountId();
    const user = StorageService.getCurrentUser();
    const items = StorageService.getContentItems();
    const notifs = StorageService.getNotifications();
    const logs = StorageService.getActivityLogs();
    const apiKey = StorageService.getGeminiApiKey();

    setAccounts(accs);
    setActiveAccountId(activeId);
    setCurrentUser(user);
    setContentItems(items);
    setNotifications(notifs);
    setActivityLogs(logs);
    setGeminiApiKeyState(apiKey);
    setIsReady(true);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const activeAccount =
    accounts.find(a => a.id === activeAccountId) ||
    accounts[0] ||
    ({
      id: "loading",
      name: "Loading...",
      slug: "loading",
      logo: "",
      description: "",
      industry: "",
      website: "",
      platforms: [],
      targetAudience: "",
      accountPurpose: "",
      scoringWeights: {
        vision: 20,
        pillars: 15,
        tone: 15,
        audience: 10,
        factual: 15,
        terminology: 5,
        visual: 10,
        accessibility: 5,
        promotional: 5,
      },
      createdAt: "",
      updatedAt: "",
      vision: {
        longTermVision: "",
        mission: "",
        coreObjectives: [],
        contentPhilosophy: "",
        desiredAudiencePerception: "",
        focusTopics: [],
        avoidedTopics: [],
      },
      contentStrategy: {
        pillars: [],
        preferredCategories: [],
        postingStyle: "",
        contentBalance: { educational: 50, entertainment: 30, promotional: 20 },
        audienceInterests: [],
        communicationApproach: "",
      },
      communicationIdentity: {
        brandVoice: "",
        tone: "",
        formalityLevel: "Professional",
        preferredVocabulary: [],
        avoidedWords: [],
        languagePreferences: "",
        writingStyleGuide: "",
      },
      visualIdentity: {
        logoUrl: "",
        primaryColor: "#0B0F19",
        secondaryColor: "#6D28D9",
        accentColor: "#06B6D4",
        backgroundColor: "#030712",
        typographyPrimary: "",
        typographySecondary: "",
        imageStyle: "",
        designReferences: [],
        approvedGraphics: [],
      },
      approvedInformation: {
        facts: [],
        products: [],
        statistics: [],
        officialClaims: [],
        importantDates: [],
        trustedDocs: [],
      },
      guidelineFiles: [],
      versionHistory: [],
    } as Account);

  const handleSetActiveAccount = (accountOrId: Account | string) => {
    const id = typeof accountOrId === "string" ? accountOrId : accountOrId.id;
    setActiveAccountId(id);
    StorageService.setActiveAccountId(id);
    handleLogActivity("Switched Account Context", `Active brand set to: ${accounts.find(a => a.id === id)?.name || id}`);
  };

  const handleSwitchUserRole = (role: UserRole) => {
    const updated = StorageService.setCurrentUserRole(role);
    setCurrentUser(updated);
    handleLogActivity("Role Switched", `Switched active preview role to: ${role}`);
  };

  const handleUpdateAccount = (account: Account) => {
    StorageService.saveAccount(account);
    setAccounts(prev => prev.map(a => (a.id === account.id ? account : a)));
  };

  const handleUpdateAccountScoringWeights = (weights: ScoringWeights) => {
    if (!activeAccount) return;
    const updated = {
      ...activeAccount,
      scoringWeights: weights,
      updatedAt: new Date().toISOString(),
    };
    handleUpdateAccount(updated);
  };

  const handleUpdateContentItem = (item: ContentItem) => {
    StorageService.saveContentItem(item);
    setContentItems(prev => {
      const idx = prev.findIndex(c => c.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [item, ...prev];
    });
  };

  const handleLogActivity = (action: string, details: string) => {
    if (!activeAccount) return;
    StorageService.logActivity({
      accountId: activeAccount.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action,
      details,
    });
    setActivityLogs(StorageService.getActivityLogs());
  };

  const handleMarkNotificationRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    setNotifications(StorageService.getNotifications());
  };

  const handleMarkAllNotificationsRead = () => {
    StorageService.markAllNotificationsAsRead();
    setNotifications(StorageService.getNotifications());
  };

  const handleSetGeminiApiKey = (key: string) => {
    StorageService.setGeminiApiKey(key);
    setGeminiApiKeyState(key);
  };

  const activeAccountContentItems = contentItems.filter(item => item.accountId === activeAccountId);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        accounts,
        activeAccount,
        setActiveAccount: handleSetActiveAccount,
        currentUser,
        switchUserRole: handleSwitchUserRole,
        contentItems,
        activeAccountContentItems,
        notifications,
        unreadNotificationsCount,
        activityLogs,
        geminiApiKey,
        setGeminiApiKey: handleSetGeminiApiKey,
        markNotificationRead: handleMarkNotificationRead,
        markAllNotificationsRead: handleMarkAllNotificationsRead,
        refreshData: loadAll,
        updateAccount: handleUpdateAccount,
        updateAccountScoringWeights: handleUpdateAccountScoringWeights,
        updateContentItem: handleUpdateContentItem,
        logActivity: handleLogActivity,
        isReady,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
