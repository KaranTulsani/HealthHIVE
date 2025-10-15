# src/step6_action_plan.py
import json
import os
from datetime import datetime

def safe_get(h, *keys, default=None):
    """Try multiple key names in dict 'h' and return first found value."""
    for k in keys:
        if k in h:
            return h[k]
    return default

def build_public_advisory(scenario: str):
    s = (scenario or "normal").strip().lower()
    if s == "accident":
        return "Major accident nearby. Please avoid the area and allow ambulances to pass."
    elif s == "outbreak":
        return "Outbreak detected. Wear masks, practice hand hygiene and avoid unnecessary hospital visits."
    elif s in ("festival", "festival crowd", "festival_crowd"):
        return "Festival surge expected. Use on-site first-aid booths for minor injuries and avoid crowded hospital lobbies."
    else:
        return "Moderate surge expected. Minimize hospital visits if possible."

def main():
    print("Loading separate models...")  # keep the same opening message for consistency

    # Load routing results saved by Step 5
    try:
        with open("plans/last_routing.json", "r", encoding="utf-8") as f:
            routing = json.load(f)
    except FileNotFoundError:
        print("❌ No routing data found. Run step5_agent_logic.py first.")
        return
    except json.JSONDecodeError:
        print("❌ plans/last_routing.json is not valid JSON. Please re-run step5 to regenerate.")
        return

    # Extract fields safely
    incident_location = routing.get("incident_location", "Unknown Location")
    scenario = routing.get("scenario", "normal")
    total_critical = int(routing.get("total_critical", 0) or 0)
    total_stable = int(routing.get("total_stable", 0) or 0)
    assignments = routing.get("assignments", [])

    # Print header
    total_patients = total_critical + total_stable
    print(f"\n🚨 Incident at {incident_location} | Scenario: {scenario.capitalize()}")
    print(f"Patients: {total_patients} total ({total_critical} critical, {total_stable} stable)\n")

    # Ambulance Dispatch (structured)
    ambulance_dispatch = []
    print("🚑 Ambulance Dispatch:")
    if assignments:
        for a in assignments:
            hid = a.get("hospital_id", "Unknown")
            hosp_name = safe_get(a, "hospital_name", "name", "hospital", default=hid)
            crit = int(a.get("assigned_critical", 0) or 0)
            stab = int(a.get("assigned_stable", 0) or 0)
            travel_min = a.get("travel_min")
            distance_km = a.get("distance_km")

            line = f"   → {hid} - {crit} critical, {stab} stable"
            # append distance/time if present
            extra = []
            if distance_km is not None:
                try:
                    extra.append(f"{float(distance_km):.2f} km")
                except Exception:
                    extra.append(str(distance_km))
            if travel_min is not None:
                try:
                    extra.append(f"{float(travel_min):.1f} min")
                except Exception:
                    extra.append(str(travel_min))
            if extra:
                line += " (" + " | ".join(extra) + ")"

            print(line)

            ambulance_dispatch.append({
                "hospital_id": hid,
                "hospital_name": hosp_name,
                "critical": crit,
                "stable": stab,
                "distance_km": distance_km,
                "travel_min": travel_min
            })
    else:
        print("   No hospital assignments available.")

    # Hospital Alerts
    hospital_alerts = []
    print("\n🏥 Hospital Alerts:")
    if assignments:
        for a in assignments:
            hid = a.get("hospital_id", "Unknown")
            hosp_name = safe_get(a, "hospital_name", "name", default=hid)
            crit = int(a.get("assigned_critical", 0) or 0)
            stab = int(a.get("assigned_stable", 0) or 0)
            alert_msg = f"Notify {hosp_name} ({hid}) of incoming patients: {crit} critical, {stab} stable"
            print(f"   - {alert_msg}")
            hospital_alerts.append({
                "hospital_id": hid,
                "hospital_name": hosp_name,
                "message": alert_msg
            })
    else:
        print("   No hospitals to alert.")

    # Staff Actions (hospital-specific + scenario-level)
    staff_actions = []
    print("\n👨‍⚕️ Staff Action:")
    if assignments:
        for a in assignments:
            hid = a.get("hospital_id", "Unknown")
            hosp_name = safe_get(a, "hospital_name", "name", default=hid)
            rec = a.get("recommendation", {}) or {}
            extra_docs = rec.get("extra_doctors", 0)
            extra_specs = rec.get("extra_specialists", 0)
            urgency = rec.get("urgency", "LOW")
            action_lines = []

            # Always prepare ER teams
            action_lines.append(f"Prepare ER teams at {hosp_name} ({hid})")

            # Add specialists/doctors if recommended
            if extra_docs > 0:
                action_lines.append(f"Mobilize +{int(extra_docs)} doctors to {hosp_name}")
            if extra_specs > 0:
                action_lines.append(f"Mobilize +{int(extra_specs)} specialists to {hosp_name}")

            # ICU/ventilator shortfalls
            icu_short = rec.get("icu_short", 0)
            vent_short = rec.get("vent_short", 0)
            if icu_short and icu_short > 0:
                action_lines.append(f"Prepare {int(icu_short)} ICU beds / transfer plan at {hosp_name}")
            if vent_short and vent_short > 0:
                action_lines.append(f"Ensure {int(vent_short)} ventilators available at {hosp_name}")

            # Supplies suggested
            oxy = rec.get("oxygen_cylinders", 0)
            blood = rec.get("blood_units", 0)
            trauma = rec.get("trauma_kits", 0)
            if oxy or blood or trauma:
                supplies = []
                if oxy: supplies.append(f"{oxy} O2 cylinders")
                if blood: supplies.append(f"{blood} blood units")
                if trauma: supplies.append(f"{trauma} trauma kits")
                action_lines.append(f"Prepare supplies: {', '.join(supplies)} at {hosp_name}")

            # Add urgency-specific note
            if urgency and urgency.upper() in ("HIGH", "CRITICAL"):
                action_lines.append(f"Urgency: {urgency.upper()} — escalate to hospital command")

            # Print each action for this hospital and collect to staff_actions
            for act in action_lines:
                print(f"   - {act}")
                staff_actions.append({
                    "hospital_id": hid,
                    "hospital_name": hosp_name,
                    "action": act
                })
    else:
        print("   No staff actions available.")

    # Add scenario-specific staff actions (single lines)
    scenario_lower = (scenario or "normal").strip().lower()
    if scenario_lower == "accident":
        extra = "Trauma & surgery units on standby"
        print(f"   - {extra}")
        staff_actions.append({"hospital_id": "ALL", "hospital_name": "ALL", "action": extra})
    elif scenario_lower == "outbreak":
        extra = "Activate infection control and isolation wards"
        print(f"   - {extra}")
        staff_actions.append({"hospital_id": "ALL", "hospital_name": "ALL", "action": extra})
    elif scenario_lower in ("festival", "festival crowd", "festival_crowd"):
        extra = "Set up temporary triage tents and crowd management"
        print(f"   - {extra}")
        staff_actions.append({"hospital_id": "ALL", "hospital_name": "ALL", "action": extra})

    # Public advisory
    public_advisory = build_public_advisory(scenario)
    print("\n📢 PUBLIC ADVISORY:")
    print(f"   {public_advisory}")

    # Build action_plan and attach to routing object
    routing["action_plan"] = {
        "incident_location": incident_location,
        "scenario": scenario,
        "summary": {
            "total_patients": total_patients,
            "total_critical": total_critical,
            "total_stable": total_stable,
            "hospitals_used": len(assignments)
        },
        "ambulance_dispatch": ambulance_dispatch,
        "hospital_alerts": hospital_alerts,
        "staff_actions": staff_actions,
        "public_advisory": public_advisory,
        "generated_at": routing.get("generated_at"),
        "action_plan_generated_at": datetime.now().isoformat(timespec="seconds")
    }

    # Save enriched routing JSON back to last_routing.json and timestamped file
    os.makedirs("plans", exist_ok=True)
    last_path = "plans/last_routing.json"
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    history_path = f"plans/routing_{timestamp}.json"

    try:
        with open(last_path, "w", encoding="utf-8") as f:
            json.dump(routing, f, indent=2, ensure_ascii=False)
        with open(history_path, "w", encoding="utf-8") as f:
            json.dump(routing, f, indent=2, ensure_ascii=False)
        print(f"\n💾 Saved routing + action plan → {last_path}")
        print(f"💾 Saved history → {history_path}")
    except Exception as e:
        print(f"❌ Failed to save action plan: {e}")

if __name__ == "__main__":
    main()
