import ProfileView from "@/components/ProfileView";

export const metadata = {
  title: "My profile — MedFund Sri Lanka",
};

export default function ProfilePage() {
  return (
    <section>
      <div className="wrap profile">
        <ProfileView />
      </div>
    </section>
  );
}