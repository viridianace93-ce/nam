# Gotcha: localStorage keys `nam_*`

**Keys:** `nam_onboarding_seen`, `nam_custom_ingredients`, `nam_favorites`, `nam_favorite_cards`, `nam_user_profile`, `nam_selected_pantry_ids`, `nam_recent_history`.

**Síntoma:** Renombrar una key “rompe” datos de usuarios existentes (parece reset).

**Fix:** No renombrar sin migración; documentar en `decisions/`.
