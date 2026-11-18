import NotificationsView from "@/components/NotificationsView";

export const metadata = {
  title: "Notifications — MedFund Sri Lanka",
};

export default function NotificationsPage() {
  return (
    <section>
      <div className="wrap profile">
        <NotificationsView />
      </div>
    </section>
  );
}