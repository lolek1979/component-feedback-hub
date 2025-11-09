# Úvod 
Aplikace má za úkol zpracovat zpětnou vazbu, kterou dostane z REST API z FE a odeslat ji na DevOps nebo Smax podle konfigurace.

# Použití
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Konfigurace služby
| Jméno       | Popis      | Povinné | Výchozí hodnota |
|---------------|------------|-------------|----------------|
|**IsEnabled** | Povoluje nebo zakazuje sekci. | Ano | false |
|**Client** | Klient na který je feedback odesílán. Možné hodnoty: "DevOps" nebo "Smax". | Ano | DevOps |
|**Endpoint** | Endpoint klienta, se kterým probíhá komunikace. Např. "https://dev.azure.com/vzp" pro DevOps nebo "https://t1servicedesk.svc.vzp.cz" Smax. | Ano ||
|**SmaxUser** | Uživatelské jméno pro Smax authentification (pouze pro Smax). | Ano pro Smax ||
|**Pass** | PAT (Personal Access Token) pro DevOps / heslo pro Smax authentification. | Ano || 
|**Priority** | Priorita (položka Urgency pro Smax). Pro DevOps možné hodnoty [1,2,3]. Pro Smax ["NoDisruption","SlightDisruption","SevereDisruption","TotalLossOfService"]. ||
|**ProjectName** | Název projektu (pouze pro DevOps). Hodnota např. "Basic" | Ano pro DevOps |
|**IncidentType** | Typ požadavku/incidentu. Pro DevOps např. "Bug", pro Smax "Request". |Ano|
|**DefaultTitle** | Výchozí popisek, například "Chyba NIS" ||
|**AreaPath** | AreaPath (pouze pro DevOps), například "Basic\\feedbackhub" ||
|**IterationPath** | IterationPath (pouze pro DevOps), například "Basic\\Sprint 1" ||
|**TenantId** | TenantId (pouze pro Smax). |Ano pro Smax|
|**ContactPerson** | ID kontaktní osoby (pouze pro Smax). ID defaultní osoby, která incident nahlásila, pokud není v Smax dohledána osoba předaná voláním API. Odkaz na záznam uživatele v Smaxu (hodnota z číselníku).|Ano pro Smax|
|**RequestsOffering** | ID RequestsOffering (pouze pro Smax). Hodnota ID z číselníku Offering (aktuálně Požadavek podpory 16540).|Ano pro Smax|
|**AffectedService** | ID AffectedService (pouze pro Smax). Hodnota ID z číselníku, která bude použita, pokud není nalezena hodnota předaná voláním API. (aktuálně SEO-Služby pro další aplikace 16329) |Ano pro Smax|
|**TitlePrefix** | Prefix pro title (pro identifikaci WI).||
|**SmaxTokenLifetime** | Délka platnosti tokenu (pouze pro Smax). Hodnota v minutách. |Ano pro Smax|

```json
// ukázka pro DevOps
"FeedbackHub": {
  "IsEnabled": true,
  "Client": "DevOps",
  "Endpoint": "https://dev.azure.com/vzp",
  "Pass": "SECRET",
  "Priority": null,
  "ProjectName": "NIS",
  "IncidentType": "Bug",
  "DefaultTitle": "Chyba NIS",
  "AreaPath": null,
  "IterationPath": null,
  "TitlePrefix": "FH"
}
```
```json
// ukázka pro Smax
  "FeedbackHub": {
    "IsEnabled": true,
    "Client": "Smax",
    "Endpoint": "https://t1servicedesk.svc.vzp.cz", 
    "Pass": "SECRET",
    "SmaxUser": "vzptestrestapiinteg",
    "Priority": "SlightDisruption",
    "IncidentType": "Request",
    "DefaultTitle": "Chyba NIS",
    "TenantId": "554007475",
    "ContactPerson": 589273,
    "RequestsOffering": 16540,
    "AffectedService": 16329,
    "TitlePrefix": "NIS",
    "SmaxTokenLifetime": 25
  }
```
Viz FeedbackHubConf.cs.