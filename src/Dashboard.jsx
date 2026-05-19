import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Plus, Trash2, Copy, CheckCircle2, Building, Edit2, 
  Search, Sun, Moon, Settings, CreditCard, Send, Eye,
  AlertTriangle, AlertCircle, ImageIcon, Loader2,
  X, MessageCircle, Menu
} from "lucide-react";

import { Inp, FileUpload, Toast, QRScannerModal } from "./DashboardUI";
import { MasterPanel } from "./MasterPanel";
import { CrmModal } from "./CrmModal";

const slugify = (text) =>
  text?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") || "salon";

const formatDateSpanish = (dateStr) => {
  if (!dateStr) return "Sin fecha";

  if (dateStr.includes("-")) {
    const [y, m, d] = dateStr.split("-");

    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    return `${parseInt(d, 10)} de ${
      months[parseInt(m, 10) - 1]
    } de ${y}`;
  }

  return dateStr;
};

const TELEGRAM_BOT_TOKEN =
  "8613978258:AAHC2F6xe9mwNxc3JFCBWWQen4CIGEqGvW8";

const TELEGRAM_CHAT_ID = "5121261948";

export default function DashboardScreen({
  user,
  onLogout,
  users,
  onUpdateUser,
  onCreateSalon,
  onDeleteSalon,
  invitations,
  onCreateInv,
  onDeleteInv,
  onUpdateInternal,
  onUpdateConfig,
  globalAlert,
  onUpdateAlert,
}) {
  const navigate = useNavigate();

  const [toast, setToast] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeCrmId, setActiveCrmId] = useState(null);

  const [showSettings, setShowSettings] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [showSupportModal, setShowSupportModal] = useState(false);

  const [supportMessage, setSupportMessage] = useState("");

  const [scanningEvent, setScanningEvent] = useState(null);

  const [validationResult, setValidationResult] = useState(null);

  const [copiedStates, setCopiedStates] = useState({});

  const [receiptFile, setReceiptFile] = useState(null);

  const [sendingReceipt, setSendingReceipt] = useState(false);

  const salonInfo = users.find((u) => u.email === user?.email);

  const [newPassword, setNewPassword] = useState("");

  const [newLogo, setNewLogo] = useState(salonInfo?.logo || "");

  const [newPhone, setNewPhone] = useState(salonInfo?.phone || "");

  const [newInstagram, setNewInstagram] = useState(
    salonInfo?.instagram || ""
  );

  const [newFacebook, setNewFacebook] = useState(
    salonInfo?.facebook || ""
  );

  const [newTiktok, setNewTiktok] = useState(
    salonInfo?.tiktok || ""
  );

  const chatEndRef = useRef(null);

  const [lastSeenChat, setLastSeenChat] = useState(
    () =>
      Number(
        localStorage.getItem(`fiesta_chat_seen_${user?.email}`)
      ) || 0
  );

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("fiesta_darkmode");

    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(
      "fiesta_darkmode",
      JSON.stringify(isDark)
    );
  }, [isDark]);

  useEffect(() => {
    if (showSupportModal) {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }

      const now = Date.now();

      setLastSeenChat(now);

      localStorage.setItem(
        `fiesta_chat_seen_${user?.email}`,
        now.toString()
      );
    }
  }, [showSupportModal, salonInfo?.support_chat, user?.email]);

  if (!user) return null;

  const notify = (m) => {
    setToast(m);

    setTimeout(() => setToast(""), 3000);
  };

  const handleCopyLink = (id, url) => {
    navigator.clipboard.writeText(url);

    setCopiedStates((prev) => ({
      ...prev,
      [id]: true,
    }));

    setTimeout(() => {
      setCopiedStates((prev) => ({
        ...prev,
        [id]: false,
      }));
    }, 2000);
  };

  const isOwner = user.role === "owner";

  const myInvs = (
    isOwner
      ? invitations
      : invitations.filter((i) => i.salonId === user.email)
  ).sort(
    (a, b) =>
      new Date(b.created_at || 0) -
      new Date(a.created_at || 0)
  );

  let filteredInvs = myInvs.filter((inv) => {
    const term = searchTerm.trim().toLowerCase();

    const data = inv.internal_data || {};

    const honoree = inv.config?.honoreeName || "";

    const matchText =
      !term ||
      inv.title?.toLowerCase().includes(term) ||
      (data.clientName || "")
        .toLowerCase()
        .includes(term) ||
      honoree.toLowerCase().includes(term);

    if (!matchText) return false;

    if (filterType === "upcoming")
      return (
        !data.internalDate ||
        new Date(data.internalDate) >=
          new Date().setHours(0, 0, 0, 0)
      );

    if (filterType === "past")
      return (
        data.internalDate &&
        new Date(data.internalDate) <
          new Date().setHours(0, 0, 0, 0)
      );

    return true;
  });

  const processQRScan = (qrString) => {
    const guestDb =
      scanningEvent.internal_data?.guests?.find(
        (g) => g.id === qrString
      ) ||
      scanningEvent.internal_data?.guests?.find((g) =>
        qrString.includes(g.id)
      );

    if (!guestDb) {
      setValidationResult({
        status: "error",
        title: "Pase Inválido",
        desc: "Este QR no pertenece a este evento o es falso.",
      });
    } else if (guestDb.status === "Ingresó") {
      setValidationResult({
        status: "warning",
        title: "Pase Usado",
        desc: `${guestDb.name} ya ingresó.`,
        data: guestDb,
      });
    } else {
      setValidationResult({
        status: "success",
        title: "Acceso Permitido",
        desc: "Pase verificado correctamente.",
        data: guestDb,
      });
    }
  };

  const confirmAccess = () => {
    const updated =
      scanningEvent.internal_data.guests.map((g) =>
        g.id === validationResult.data.id
          ? { ...g, status: "Ingresó" }
          : g
      );

    onUpdateInternal(
      scanningEvent.id,
      "guests",
      updated
    );

    setValidationResult(null);

    notify("Ingreso registrado");
  };

  const handleSendReceipt = async () => {
    if (!receiptFile)
      return alert(
        "Por favor, seleccioná una foto del comprobante primero."
      );

    setSendingReceipt(true);

    try {
      const formData = new FormData();

      formData.append("chat_id", TELEGRAM_CHAT_ID);

      formData.append("photo", receiptFile);

      formData.append(
        "caption",
        `💰 Nuevo Comprobante de Pago\n🏢 Salón: ${user.name}\n📧 Email: ${user.email}`
      );

      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        notify("¡Comprobante enviado con éxito!");

        setShowPaymentModal(false);

        setReceiptFile(null);
      } else {
        alert(
          "No se pudo enviar el comprobante. Verificá la configuración del bot."
        );
      }
    } catch (e) {
      alert(
        "Error de red al intentar enviar el comprobante."
      );
    }

    setSendingReceipt(false);
  };

  const handleSendSupportMessage = async () => {
    if (!supportMessage.trim()) return;

    const newMsg = {
      sender: "salon",
      text: supportMessage,
      date: new Date().toISOString(),
    };

    const chatArray = [
      ...(salonInfo?.support_chat || []),
      newMsg,
    ];

    setSupportMessage("");

    await onUpdateUser(user.email, {
      support_chat: chatArray,
    });

    try {
      const formData = new FormData();

      formData.append("chat_id", TELEGRAM_CHAT_ID);

      formData.append(
        "text",
        `🆘 *NUEVO MENSAJE DE SOPORTE*\n🏢 Salón: ${user.name}\n\n💬 Mensaje:\n_${newMsg.text}_\n\n📲 _Entrá al Master Panel para responderle._`
      );

      formData.append("parse_mode", "Markdown");

      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          body: formData,
        }
      );
    } catch (e) {
      console.error(
        "Error enviando notificación a Telegram:",
        e
      );
    }
  };

  if (isOwner) {
    return (
      <MasterPanel
        mySalons={users.filter(
          (u) => u.role === "salon"
        )}
        onLogout={onLogout}
        onCreateSalon={onCreateSalon}
        onUpdateUser={onUpdateUser}
        onDeleteSalon={onDeleteSalon}
        globalAlert={globalAlert}
        onUpdateAlert={onUpdateAlert}
      />
    );
  }

  const themeBg = isDark
    ? "bg-slate-900"
    : "bg-[#f1f3f9]";

  const themeNav = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";

  const themeText = isDark
    ? "text-white"
    : "text-slate-800";

  const themeCard = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200/60";

  const isDemo = salonInfo?.is_demo;

  const invitesCreated =
    salonInfo?.invites_created || 0;

  const canCreate =
    !isDemo || invitesCreated < 3;

  const chatArr = salonInfo?.support_chat || [];

  const lastMsg =
    chatArr[chatArr.length - 1];

  const hasUnreadChat =
    lastMsg &&
    lastMsg.sender === "master" &&
    new Date(lastMsg.date).getTime() >
      lastSeenChat;

  return (
    <div
      className={`min-h-screen pb-20 text-left transition-colors duration-300 ${themeBg}`}
    >
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }

          .only-print {
            display: block !important;
          }
        }
      `}</style>

      {/* TODO TU JSX ORIGINAL COMPLETO ACÁ */}

      {activeCrmId && (
        <CrmModal
          activeInv={myInvs.find(
            (i) => i.id === activeCrmId
          )}
          onClose={() =>
            setActiveCrmId(null)
          }
          user={user}
          salonInfo={salonInfo}
          onUpdateInternal={
            onUpdateInternal
          }
          onUpdateConfig={
            onUpdateConfig
          }
          isDark={isDark}
        />
      )}

      {scanningEvent &&
        !validationResult && (
          <QRScannerModal
            onClose={() =>
              setScanningEvent(null)
            }
            onScan={processQRScan}
          />
        )}

      {toast && <Toast msg={toast} />}
    </div>
  );
}
