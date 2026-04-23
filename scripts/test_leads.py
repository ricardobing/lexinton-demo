import urllib.request, json, time, sys, os

os.chdir(r'c:\tmp\lexinton-web')
KEY = open('.env.local').read().split('TOKKO_API_KEY=')[1].split('\n')[0].strip()
BASE_LOCAL = "http://localhost:3000"
BASE_TOKKO = "https://www.tokkobroker.com/api/v1"

print("=== TEST DE FORMULARIOS LEXINTON ===\n")

# PASO 1: Obtener un ID de propiedad real para el test
url = f"{BASE_TOKKO}/property/?key={KEY}&format=json&limit=1"
data = json.loads(urllib.request.urlopen(url).read())
prop_id = data['objects'][0]['id']
prop_addr = data['objects'][0].get('address', 'Test Address')
print(f"Propiedad de test: ID={prop_id}, Direccion={prop_addr}")

# PASO 2: Enviar lead de test
print("\n--- Enviando lead de test via /api/leads ---")
test_lead = {
    "nombre": "TEST AUTOMATIZADO - IGNORAR",
    "email": "test.automatizado@lexinton-dev.com",
    "telefono": "+54 11 0000-0000",
    "mensaje": "TEST AUTOMATIZADO - Este lead fue generado por script de QA. Por favor ignorar y eliminar.",
    "tipo": "Test QA - Eliminar",
    "propiedad_id": prop_id,
}
req = urllib.request.Request(
    f"{BASE_LOCAL}/api/leads",
    data=json.dumps(test_lead).encode(),
    headers={"Content-Type": "application/json"},
    method="POST"
)
try:
    res = urllib.request.urlopen(req, timeout=15)
    response_data = json.loads(res.read())
    print(f"OK Respuesta de /api/leads: {response_data}")
except urllib.error.HTTPError as e:
    error_body = e.read().decode()
    print(f"ERROR {e.code}: {error_body}")
    sys.exit(1)

# PASO 3: Esperar y verificar en Tokko
print("\n--- Esperando 3 segundos y verificando en Tokko ---")
time.sleep(3)

for endpoint, label in [("/webcontact/", "webcontact"), ("/lead/", "lead"), ("/opportunity/", "opportunity")]:
    try:
        r = urllib.request.urlopen(f"{BASE_TOKKO}{endpoint}?key={KEY}&format=json&limit=10", timeout=10)
        d = json.loads(r.read())
        if 'objects' in d:
            print(f"Endpoint {label}: {len(d['objects'])} registros")
            for o in d['objects'][:3]:
                name = o.get('name') or o.get('contact', {}).get('name', 'Sin nombre')
                email = o.get('email') or o.get('contact', {}).get('email', '')
                print(f"  - {name} | {email}")
                if 'TEST' in str(name).upper() or 'test.automatizado' in str(email):
                    print(f"    >>> LEAD DE TEST ENCONTRADO ID: {o.get('id')}")
        else:
            print(f"Endpoint {label}: {str(d)[:150]}")
    except Exception as e:
        print(f"Endpoint {label}: {e}")

# PASO 4: Lead general sin property
print("\n--- Enviando lead general (sin propiedad) ---")
test_general = {
    "nombre": "TEST GENERAL - IGNORAR",
    "email": "test.general@lexinton-dev.com",
    "telefono": "+54 11 0000-0001",
    "mensaje": "TEST AUTOMATIZADO GENERAL - Ignorar y eliminar.",
    "tipo": "Test QA General - Eliminar",
    "propiedad_id": None,
}
req2 = urllib.request.Request(
    f"{BASE_LOCAL}/api/leads",
    data=json.dumps(test_general).encode(),
    headers={"Content-Type": "application/json"},
    method="POST"
)
try:
    res2 = urllib.request.urlopen(req2, timeout=15)
    print(f"OK Lead general enviado: {json.loads(res2.read())}")
except urllib.error.HTTPError as e:
    print(f"ERROR: {e.read().decode()}")

print(f"\n=== RESULTADO ===")
print(f"Verificar en panel Tokko: test.automatizado@lexinton-dev.com (propiedad ID {prop_id})")
print("Una vez verificado, eliminar manualmente desde el panel de Tokko.")
